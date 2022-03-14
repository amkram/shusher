import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FileDrop } from "react-file-drop";
import Collapse from "@material-ui/core/Collapse";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import TreeForm from "./TreeForm";
import SubtreeForm from "./SubtreeForm";
import FileUploadButton from "./FileUploadButton";
import RunButton from "./RunButton";
import UsherProgress from "./UsherProgress";
import { getFileType } from "../tools/files/fileHandling";
import { fastaToVcf } from "../tools/alignment/fastaToVcf";
import { referenceGenomeUrl } from "../data/constants";
import { getTreeJson } from "../tools/auspice/showTree";
import { ungzip } from "node-gzip";
import UsherResults from "./UsherResults";
import ProcessingFile from "./ProcessingFile";
import Grid from "@material-ui/core/Grid";
import InfoTooltip from "./InfoTooltip";
import ConfirmationDialog from "./ConfirmationDialog";
import ErrorSnackbar from "./ErrorSnackbar";
import Button from "@material-ui/core/Button";
import InfoSection from './InfoSection';
import Troubleshooting from "./Troubleshooting";

/**
 * This component contains most of web app logic for running UShER.
 * It is added to the page in App.js.
 */

const useStyles = makeStyles((theme) => ({
  root: {
    width: "55vw",
    maxWidth: "600px",
    margin: "0 auto",
  },
  wrapper: {
    height: "210px",
    boxShadow: "0px 0px 4px 1px #ddd inset",
    borderRadius: "6px",
    backgroundColor: "#fafafa",
  },
  fileDrop: {
    height: "100%",
    width: "100%",
    margin: "0 auto",
    display: "flex",
  },
  fileDropTarget: {
    width: "100%",
    heigth: "100%",
  },
  fileDropDraggingFrame: {
    backgroundColor: "#eeeeee",
    borderRadius: "6px",
    boxShadow: "0px 0px 4px 1px #ddd inset",
  },
  heading: {
    textAlign: "center",
    paddingTop: "25px",
  },
  overlay: {
    position: "relative",
    top: "-210px",
    textAlign: "center",
  },
  fileIcon: {
    width: "50px",
    opacity: 0.5,
  },
  loadedFileChip: {
    borderRadius: "7px",
    backgroundColor: "#b1e3b5",
    margin: "0 auto",
    fontSize: 14,
  },
  usherCard: {
    display: "block",
    margin: "0 auto",
    minWidth: "100%",
    textAlign: "right",
    paddingLeft: "30px",
  },
  troubleCard: {
    marginTop: "50px",
    display: "block",
    margin: "0 auto",
    minWidth: "80%",
    textAlign: "left",
    paddingLeft: "30px",
  },

  usherCardInner: {
    display: "flex",
    justifyContent: "center",
    marginTop: "4vh",
    fontSize: 16,
  },
  leftAlignItem: {
    textAlign: "left",
  },
  form: {
    display: "inline",
    maxWidth: "30%",
  },
  usherCardBottomItem: {
    marginBottom: "42px",
  },
  smallText: {
    fontSize: "10pt",
  },
}));

export default function UsherFrame(props) {
  const classes = useStyles();
  const [uploadCollapsed, setUploadCollapsed] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [loadedFile, setLoadedFile] = React.useState("");
  const [newSamplesReady, setNewSamplesReady] = React.useState(false);
  const [currentSample, setCurrentSample] = React.useState(0);
  const [currentStage, setCurrentStage] = React.useState({});
  const [processingFile, setProcessingFile] = React.useState(false);
  const [totalSamples, setTotalSamples] = React.useState(Infinity);
  const [usherCompleted, setUsherCompleted] = React.useState(false);
  const [subtreeFiles, setSubtreeFiles] = React.useState([]);
  const [sampleData, setSampleData] = React.useState([]);
  const [samplesPerSubtree, setSamplesPerSubtree] = React.useState(1000);
  const [started, setStarted] = React.useState(false);
  const [showCancelUsherDialog, setShowCancelUsherDialog] =
    React.useState(false);
  const [useExample, setUseExample] = React.useState(false);

  const cancelDialogTitle = "UShER is running";
  const cancelDialogText =
    "To cancel the currently running job, please reload the page.";
  const invalidFileText =
    "Unsupported file. Please upload a file with extension .fasta, .fa, or .vcf";
  const usherErrorText =
    "An error occured. Please reload the page and try again.";

  const [errorMessage, setErrorMessage] = React.useState("");
  const [showError, setShowError] = React.useState(false);

  const handleDialogClose = () => {
    setShowCancelUsherDialog(false);
  };
  const deleteFile = () => {
    setUploadCollapsed(false);
    setShowResults(false);
    setNewSamplesReady(false);
    setLoadedFile("");
  };
  const handleDelete = () => {
    if (started) {
      console.log("already started");
      setShowCancelUsherDialog(true);
    } else {
      deleteFile();
    }
  };
  const handleCloseError = () => {
    setShowError(false);
  };

  // Handles FASTA and VCF files
  const handleUploadFile = (file) => {
    setProcessingFile(true);
    file.arrayBuffer().then((buf) => {
      var extension = getFileType(file);
      var converted;
      if (!extension) {
        setProcessingFile(false);
        setErrorMessage(invalidFileText);
        setShowError(true);
        return;
      }
      window.FS.writeFile("/new_samples." + extension, new Uint8Array(buf));
      console.log(" wrote" + extension + " to FS");

      // FASTA files need to be converted to VCF before running UShER.
      if (extension === "fasta") {
        // First download the reference FASTA...
        window
          .saveFileFromUrl(
            "/reference.fasta.gz",
            referenceGenomeUrl,
            "application/x-gzip"
          )
          .then(() => {
            console.log("Downloaded reference.");
            return window.FS.readFile("/reference.fasta.gz");
          })
          .then((compressed) => {
            return ungzip(compressed);
          })
          .then((decompressed) => {
            // ...then convert it to VCF
            console.log("unzipping...");
            FS.writeFile("/reference.fasta", decompressed);
            console.log("converting to vcf...");
            converted = fastaToVcf("/new_samples.fasta", "/new_samples.vcf");
            if (converted !== true) {
              setErrorMessage(converted.message);
              setShowError(true);
              setProcessingFile(false);
              return;
            }
            console.log("done.");
            setLoadedFile(file);
            setNewSamplesReady(true);
            setUploadCollapsed(true);
            setProcessingFile(false);
          });
      } else {
        setUploadCollapsed(true);
        setNewSamplesReady(true);
        setLoadedFile(file);
        setProcessingFile(false);
      }
    });
  };
  const handleUseExample = () => {
    console.log("using example");
    setProcessingFile(true);
    setUploadCollapsed(true);
    var file = { name: "example1_typical_use_case.fasta", size: 10000 };
    setLoadedFile(file);
    setUseExample(true);
    setNewSamplesReady(true);
    setProcessingFile(false);
  };
  const handleDropFile = (event) => {
    handleUploadFile(event.dataTransfer.files[0]);
  };

  const handleRunUsher = () => {
    if (started) {
      console.log("already started");
      setShowCancelUsherDialog(true);
      return;
    }
    if (!samplesPerSubtree > 0) {
      console.log("Samples must be > 0");
      return;
    }
    if (props.latestTreeDownloaded && newSamplesReady && props.jsReady) {
      var sampleFileName;
      // Pick either the user-supplied VCF (or VCF made from user FASTA)
      // or the example VCF file.
      if (useExample) {
        sampleFileName = "/preload/test_samples.vcf";
      } else {
        sampleFileName = "/new_samples.vcf";
      }

      // "Command-line" arguments passed to UShER main function.
      var args = [
        "-k", // number of samples per subtree
        "" + samplesPerSubtree,
        "-i", // input protobuf
        "/latest_tree.pb.gz",
        "-v", // vcf file of new samples
        sampleFileName,
        "-d", // output directory (within virtual browser FS)
        "/",
        "-T1", // number of threads (1). Multi-threading currently causes bugs.
      ];

      window.callMain(args);
      console.log(args);
      console.log("Running usher." + samplesPerSubtree);
      setShowResults(true);
      setStarted(true);
      setInterval(trackUsherProgress, 500);
    } else {
      console.log("Not ready yet...");
    }
  };

  const createData = (sampleName, numPlacements, parsimonyScore) => {
    return { sampleName, numPlacements, parsimonyScore };
  };
  const handleCompleted = (stderr, totalSamples) => {
    if (!window.usherCompleted) {
      console.log(usherCompleted);
      setUsherCompleted(true);
      window.usherCompleted = true;
      var sampleData = [];

      // Parse stderr for details of UShER run
      var subtreeFiles = stderr.match(/subtree-.*nh/g);
      console.log(subtreeFiles);
      setSubtreeFiles(subtreeFiles);
      var stderrLines = stderr.match(/Sample name:.*\n/g);
      for (var i = 0; i < totalSamples; i++) {
        var currLine = stderrLines[i];
        var name = currLine.split("\t")[0].split(": ")[1];
        var score = parseInt(currLine.split("score: ")[1].split("\t")[0]);
        var nplace = parseInt(currLine.split("placements: ")[1].split("\n")[0]);
        sampleData.push(createData(name, nplace, score));
      }
      const userSamples = sampleData.map((s) => s.sampleName);

      //UShER outputs newick files for each subtree. Convert
      //them to JSON that can be loaded by Auspice.
      var file;
      var fileText;
      var jsons = [];
      var json;
      var currSample;
      for (var i = 0; i < subtreeFiles.length; i++) {
        fileText = window.FS.readFile("/" + subtreeFiles[i], {
          encoding: "utf8",
        });
        json = getTreeJson(fileText, userSamples, "subtree " + (i + 1));
        jsons.push(json);
        for (var j = 0; j < totalSamples; j++) {
          currSample = sampleData[j];
          if (JSON.stringify(json).includes(currSample.sampleName)) {
            sampleData[j].subtree = i + 1;
          }
        }
      }
      setSampleData(sampleData);

      // Assign the window a unique ID. This handles the case of
      // multiple tabs running ShUShER.
      var windowId = "usher_" + window.localStorage.length;
      window.localStorage.setItem(windowId, JSON.stringify(jsons));
      window.id = windowId;
    }
  };

  // Periodically parse the stderr output of UShER to track it's progress.
  const trackUsherProgress = () => {
    var stderr = window.Module.usher_err;
    var completed = false;

    if (stderr) {
      var samplesFinished = (stderr.match(/Sample name/g) || []).length;
      var error =
        (stderr.match(/error/g) || []).length > 0 ||
        (stderr.match(/Error/g) || []).length > 0;
      var startedSamples = (stderr.match(/Found/g) || []).length;
      var totalSamples =
        startedSamples > 0
          ? parseInt(stderr.split("Found ")[1].split(" missing samples.")[0])
          : Infinity;
      completed = stderr.match(/Computing subtrees/g)
        ? (
            stderr
              .split("Computing subtrees for added")[1]
              .match(/Completed/g) || []
          ).length == 1
        : false;
      setTotalSamples(totalSamples);
      var savingTree = (stderr.match(/Writing/g) || []).length;
      if (error) {
        console.log("There was an error.");
        setErrorMessage(usherErrorText);
        setShowError(true);
        clearInterval(trackUsherProgress);
      }
      if (!startedSamples) {
        setCurrentStage({ id: 0, message: "Loading global tree..." });
      } else if (savingTree && !completed) {
        setCurrentStage({ id: 2, message: "Finishing up..." });
      } else if (completed) {
        setCurrentSample({ id: 3, message: "Done!" });
        clearInterval(trackUsherProgress);
        handleCompleted(stderr, totalSamples);
      } else {
        setCurrentSample(samplesFinished);
        setCurrentStage({
          id: 1,
          message:
            "Placing sample " +
            (samplesFinished * 1 + 1) +
            "/" +
            totalSamples +
            "...",
        });
      }
    }
  };

  return (
    <div className={classes.root}>
      <h3 className={classes.heading}>Load your data</h3>

      <ConfirmationDialog
        onClose={handleDialogClose}
        title={cancelDialogTitle}
        text={cancelDialogText}
        open={showCancelUsherDialog}
      />
      <ErrorSnackbar
        text={errorMessage}
        open={showError}
        onClose={handleCloseError}
      />

      <Collapse in={!uploadCollapsed}>
        {processingFile ? (
          <div className={classes.wrapper}>
            {" "}
            <ProcessingFile />{" "}
          </div>
        ) : (
          <div className={classes.wrapper}>
            <FileDrop
              className={classes.fileDrop}
              targetClassName={classes.fileDropTarget}
              draggingOverFrameClassName={classes.fileDropDraggingFrame}
              onFrameDrop={handleDropFile}
            />
            <div className={classes.overlay}>
              <p>Drag a FASTA or VCF file here</p>
              <img
                src="/dist/img/icon-file-light.png"
                className={classes.fileIcon}
              />
              <p>
                or&nbsp; <FileUploadButton callback={handleUploadFile} />
              </p>
              <p className={classes.smallText}>
                No data? Try
                <Button color="#5c0404" onClick={handleUseExample}>
                  an example
                </Button>
                (
                <a
                  target="_blank"
                  href="https://raw.githubusercontent.com/russcd/USHER_DEMO/master/example1_typical_use_case.fasta"
                >
                  view file
                </a>
                )
              </p>
              <br />
            </div>
          </div>
        )}
      </Collapse>

      <Collapse in={uploadCollapsed}>
        <Chip
          className={classes.loadedFileChip}
          onDelete={handleDelete}
          icon={<img src="/dist/img/icon-file-light.png" width="20px" />}
          label={
            loadedFile.name +
            " (" +
            Number(loadedFile.size / 1000000).toFixed(2) +
            " MB)"
          }
        />
      </Collapse>
      <Collapse in={uploadCollapsed}>
        <div>
          <h3 className={classes.heading}>Place samples</h3>
          <Card className={classes.usherCard}>
            <div className={classes.usherCardInner}>
              <Grid container spacing={1}>
                <Grid item xs={5}>
                  <strong>Using tree:</strong>
                </Grid>
                <Grid item xs={4} className={classes.leftAlignItem}>
                  <Grid container spacing={1}>
                    <Grid item>
                      <InfoTooltip
                        text={
                          "Your samples will be placed on this existing tree. Currently, the only supported option is the SARS-CoV-2 public tree, which includes publicly available sequences aggregated from GenBank, COG-UK, and the China National Center for Bioinformation"
                        }
                      />
                    </Grid>
                    <Grid item>
                      <TreeForm className={classes.form} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={3} className={classes.leftAlignItem}>
                  <RunButton
                    handleRunUsher={handleRunUsher}
                    showLoading={
                      !(
                        props.latestTreeDownloaded &&
                        newSamplesReady &&
                        props.jsReady
                      )
                    }
                  />
                </Grid>
                <Grid item xs={5} className={classes.usherCardBottomItem}>
                  <strong>Number of samples per subtree:</strong> <br />
                </Grid>
                <Grid item xs={4} className={classes.leftAlignItem}>
                  <Grid container spacing={1}>
                    <Grid item>
                      <InfoTooltip
                        text={
                          "After placement, you can view the subtrees of the full tree that your samples were placed on. This parameter sets the number of samples to include in each subtree."
                        }
                      />
                    </Grid>
                    <Grid item>
                      <SubtreeForm
                        setValue={setSamplesPerSubtree}
                        className={classes.form}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Card>
        </div>
      </Collapse>

      <Collapse in={showResults}>
        <div>
          <h3 className={classes.heading}>View Results</h3>
          <Card className={classes.resultsCardInner}>
            {usherCompleted ? (
              <UsherResults
                sampleData={sampleData}
                subtreeFiles={subtreeFiles}
              />
            ) : (
              <UsherProgress
                value={Math.min(
                  ((currentSample + 1) / totalSamples) * 100,
                  100
                )}
                currentStage={currentStage}
              />
            )}
          </Card>
        </div>
      </Collapse>
      <Card className={classes.troubleCard}>
        <Troubleshooting />
      </Card>
      
      <InfoSection />
    </div>
  );
}
