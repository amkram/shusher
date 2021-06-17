import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FileDrop } from 'react-file-drop'
import Collapse from '@material-ui/core/Collapse'
import Fade from '@material-ui/core/Fade'
import Chip from '@material-ui/core/Chip'
import Card from '@material-ui/core/Card'
import TreeForm from './TreeForm'
import SubtreeForm from './SubtreeForm'
import FileUploadButton from './FileUploadButton'
import RunButton from './RunButton'
import UsherProgress from './UsherProgress'
import { getFileType } from '../tools/files/fileHandling'
import { fastaToVcf } from '../tools/alignment/fastaToVcf'
import { referenceGenomeUrl } from '../data/constants'
import { ungzip } from 'node-gzip'
import UsherResults from './UsherResults'
import ProcessingFile from './ProcessingFile'
import Grid from '@material-ui/core/Grid'
import InfoTooltip from './InfoTooltip'


const useStyles = makeStyles((theme) => ({
    root: {
        width: '55vw',
        maxWidth: '600px',
        margin: '0 auto',

    },
    wrapper: {
        height: '180px',  
        boxShadow: '0px 0px 4px 1px #ddd inset',
        borderRadius: '6px',
        backgroundColor: '#fafafa',
    },
    fileDrop: {
        height: '100%',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
  
    },
    fileDropTarget: {
        width: '100%',
        heigth: '100%',
    },
    fileDropDraggingFrame: {
        backgroundColor: '#eeeeee',
        borderRadius: '6px',
        boxShadow: '0px 0px 4px 1px #ddd inset',
    },
    heading: {
        textAlign: 'center',
        paddingTop: '25px'
    },
    overlay: {
        position: 'relative',
        top: '-180px',        
        textAlign: 'center',
        
    },
    fileIcon: {
        width: '50px',
        opacity: 0.5
    },
    loadedFileChip: {
        borderRadius: '7px',
        backgroundColor: '#b1e3b5',
        margin: '0 auto',
        fontSize: 14
    },
    usherCard: {
        display: 'block',
        margin: '0 auto',
        minWidth: '100%',
        textAlign: 'right',
        paddingLeft: '30px'
    },
    usherCardInner: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '4vh',
        fontSize: 16
    },
    leftAlignItem: {
        textAlign: 'left'
    },
    form: {
      display: 'inline',
      maxWidth: '30%'  
    },
    usherCardBottomItem: {
        marginBottom: '42px'
    }
  }));

function UsherFrame(props) {
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
    const [samplesPerSubtree, setSamplesPerSubtree] = React.useState(50);
    

    const handleDelete = () => {
        setUploadCollapsed(false);
        setShowResults(false);
        setNewSamplesReady(false);
        setLoadedFile("");
    };
    const handleUploadFile = (file) => {
        setProcessingFile(true);
        file.arrayBuffer().then(buf => {
            var extension = getFileType(file);
            if (!extension) {
                console.log('Please upload a fasta or vcf file');
                return;
            }
            window.FS.writeFile('/new_samples.' + extension, new Uint8Array(buf));
            console.log(' wrote' + extension +  ' to FS');
            if (extension === 'fasta') {
                window.saveFileFromUrl('/reference.fasta.gz', referenceGenomeUrl, 'application/x-gzip').then(() => {
					console.log('Downloaded reference.');  
                    return window.FS.readFile('/reference.fasta.gz');
				}).then((compressed) => {
                    return ungzip(compressed);
                }).then((decompressed) => {
                    console.log('unzipping...');
                    FS.writeFile('/reference.fasta', decompressed);
                    console.log('converting to vcf...');
                    fastaToVcf('/new_samples.fasta', '/new_samples.vcf');
                    console.log('done.');
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
    }
    const handleDropFile = (event) => {
        handleUploadFile(event.dataTransfer.files[0]);
    }
    const handleRunUsher = () => {
        console.log(props.latestTreeDownloaded);
        console.log(newSamplesReady);
        if (!samplesPerSubtree > 0) {
            console.log("Samples must be > 0");
            return;
        }
        if (props.latestTreeDownloaded && newSamplesReady) {
            var args = ['-k', samplesPerSubtree, '-i', '/latest_tree.pb.gz', '-v', '/new_samples.vcf', '-d', '/'];
            window.callMain(args);
            console.log('Running usher.' + samplesPerSubtree);
            setShowResults(true);
            setInterval(trackUsherProgress, 500);
        } else {
            console.log("Not ready yet...");
        }
    }
    const createData = (sampleName, numPlacements, parsimonyScore) => {
        return { sampleName, numPlacements, parsimonyScore };
    }
    const handleCompleted = (stderr, totalSamples) => {
        setUsherCompleted(true);
        var sampleData = [];
        var subtreeFiles = stderr.match(/subtree-.*nh/g);
        setSubtreeFiles(subtreeFiles);
        var stderrLines = stderr.match(/Sample name:.*\n/g);
        for (var i = 0; i < totalSamples; i++) {
            var currLine = stderrLines[i];
            var name = currLine.split('\t')[0].split(': ')[1];
            var score = parseInt(currLine.split('score: ')[1].split('\t')[0]);
            var nplace = parseInt(currLine.split('placements: ')[1].split('\n')[0]);
            sampleData.push(createData(name, nplace, score));
        }
        setSampleData(sampleData);
    }
    const trackUsherProgress = () => {
        var stderr = window.Module.usher_err;
        var completed = false;
        if (stderr) {
            var samplesFinished = (stderr.match(/Sample name/g) || []).length;
            var error = (stderr.match(/error/g) || []).length > 0 || (stderr.match(/Error/g) || []).length > 0;
            var startedSamples = (stderr.match(/Found/g) || []).length;
            var totalSamples = startedSamples > 0 ? parseInt(stderr.split('Found ')[1].split(' missing samples.')[0]) : Infinity;
            completed = stderr.match(/Computing subtrees/g) ? (stderr.split('Computing subtrees for added')[1].match(/Completed/g) || []).length == 1: false;
            setTotalSamples(totalSamples);
            var savingTree = (stderr.match(/Writing/g) || []).length;
            if (error) {
                console.log("There was an error.")
            }
            if (!startedSamples) {
                setCurrentStage({id: 0, message: 'Loading global tree...'});
            } else if (savingTree && !completed) {
                setCurrentStage({id: 2, message: 'Finishing up...'});
            } else if (completed) {
                handleCompleted(stderr, totalSamples);
            } else {
                setCurrentSample(samplesFinished);
                setCurrentStage({id: 1, message: 'Placing sample ' + (samplesFinished*1+1) + '/' + totalSamples + '...'});
            }
        }
    }

    

    return (
        <div className={classes.root}>
        <h3 className={classes.heading}>Load your data</h3>
        
        <Collapse in={!uploadCollapsed}>
        {processingFile ? 
            <div className={classes.wrapper}> <ProcessingFile /> </div>
            : <div className={classes.wrapper}>
                <FileDrop
                    className={classes.fileDrop}
                    targetClassName={classes.fileDropTarget}
                    draggingOverFrameClassName={classes.fileDropDraggingFrame}
                    onFrameDrop={handleDropFile}
                />
                <div className={classes.overlay}>
                    <p>Drag a FASTA or VCF file here</p>
                    <img src="/dist/img/icon-file-light.png" className={classes.fileIcon}/>
                    <p>or&nbsp; <FileUploadButton callback={handleUploadFile}/> </p>
                </div>
            </div>}

        </Collapse>

        <Fade in={uploadCollapsed}>
            <Chip 
                className={classes.loadedFileChip}
                onDelete={handleDelete}
                icon={<img src="/dist/img/icon-file-light.png" width='20px'/>}
                label={loadedFile.name + ' (' + Number(loadedFile.size / 1000000).toFixed(2) + ' MB)'}
            /> 
        </Fade>
        <Fade in={uploadCollapsed}>
            <div>
                <h3 className={classes.heading}>Place samples</h3>
                <Card className={classes.usherCard}>
                    <div className={classes.usherCardInner}>
                    <Grid container spacing={3}>
                        <Grid item xs={5}>
                                
                                <strong>Using tree:</strong>
                        </Grid>
                        <Grid item xs={7} className={classes.leftAlignItem}>
                        <Grid container spacing={1} alignItems="flex-end">
                            <Grid item>
                            <InfoTooltip text={
                                'Your samples will be placed on this existing tree. Currently, the only supported option is the SARS-CoV-2 public tree, which includes publicly available sequences aggregated from GenBank, COG-UK, and the China National Center for Bioinformation'
                            } />
                        
                            </Grid>
                            <Grid item>
                             <TreeForm className={classes.form}/>
                            </Grid>
                        </Grid>
                        </Grid>
                            
                        <Grid item xs={5} className={classes.usherCardBottomItem}>
                       
                                <strong>Number of samples per subtree:</strong> <br />
                        </Grid>
                        <Grid item xs={4} className={classes.leftAlignItem}>
                        <Grid container spacing={1} alignItems="flex-end">
                            <Grid item>
                                <InfoTooltip text={
                                        'After placement, you can view the subtrees of the full tree that your samples were placed on. This parameter sets the number of samples to include in each subtree.'
                                    } />
                            </Grid>
                            <Grid item>
                                <SubtreeForm setValue={setSamplesPerSubtree} className={classes.form}/>
                            </Grid>
                        </Grid>
                            
                        </Grid>
                        <Grid item xs={3} className={classes.leftAlignItem}>
                            <RunButton handleRunUsher={handleRunUsher} showLoading={!(props.latestTreeDownloaded && newSamplesReady)}/>
                        </Grid>
                    </Grid>
                    </div>
                </Card>
            </div>
        </Fade>
        <Fade in={showResults}>
            <div>
                <h3 className={classes.heading}>View Results</h3>
                <Card className={classes.resultsCardInner}>
                    {usherCompleted ? <UsherResults sampleData={sampleData} subtreeFiles={subtreeFiles} showTreeWrapper={props.showTreeWrapper}/>
                    : <UsherProgress value={10*currentStage.id + (currentSample/totalSamples) * (80/totalSamples)} currentStage={currentStage}/>}
                </Card>
            </div>
        </Fade>
        
        </div>
    );
}

export default UsherFrame;
