import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FileDrop } from 'react-file-drop';
import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import TreeForm from './TreeForm'
import FileUploader from './FileUploader';
import RunButton from './RunButton';
import UsherProgress from './UsherProgress';


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
        height: '10vh',
        minWidth: '400px'
    },
    usherCardInner: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '4vh',
        fontSize: 16
    },
  }));

function UsherFrame(props) {
    const classes = useStyles();
    const [uploadCollapsed, setUploadCollapsed] = React.useState(true);
    const [showResults, setShowResults] = React.useState(false);
    const [loadedFile, setLoadedFile] = React.useState("");
    const [newSamplesReady, setNewSamplesReady] = React.useState(false);
    const [currentSample, setCurrentSample] = React.useState(0);
    

    const handleDelete = () => {
        setUploadCollapsed(false);
        setShowResults(false);
        setNewSamplesReady(false);
        setLoadedFile("");
    };
    const handleUpload = (file) => {
        setLoadedFile(file);
        file.arrayBuffer().then(buf => 
            window.FS.writeFile('/new_samples.vcf', new Uint8Array(buf)),
            console.log('wrote new samples to FS'),
            setNewSamplesReady(true)
        );
        setUploadCollapsed(true);
    }
    const handleRunUsher = () => {
        console.log(props.latestTreeDownloaded);
        console.log(newSamplesReady);
        
        if (props.latestTreeDownloaded && newSamplesReady) {
            var args = ['-k', '50', '-i', '/latest_tree.pb', '-v', '/new_samples.vcf', '-d', '/'];
            window.callMain(args);
            console.log('Running usher.');
            setShowResults(true);
            setInterval(trackUsherProgress, 500);
        } else {
            console.log("Not ready yet...");
        }
    }
    const trackUsherProgress = () => {
        if (window.Module.usher_err) {
            setCurrentSample((window.Module.usher_err.match(/Sample name/g) || []).length);
        }
    }
    

    return (
        <div className={classes.root}>
        <h3 className={classes.heading}>Load your data</h3>
        
        <Collapse in={!uploadCollapsed}>
        <div className={classes.wrapper}>

            <FileDrop
                className={classes.fileDrop}
                targetClassName={classes.fileDropTarget}
                draggingOverFrameClassName={classes.fileDropDraggingFrame}
            />
            <div className={classes.overlay}>
                <p>Drag a FASTA or VCF file here</p>
                <img src="/dist/img/icon-file-light.png" className={classes.fileIcon}/>
                <p>or&nbsp; <FileUploader callback={handleUpload}/> </p>
            </div>
        </div>

        </Collapse>

        <Fade in={uploadCollapsed}>
            <Chip 
                className={classes.loadedFileChip}
                onDelete={handleDelete}
                icon={<img src="/dist/img/icon-file-light.png" width='20px'/>}
                label={loadedFile.name + ' (' + Number(loadedFile.size / 1000000).toFixed(1) + ' MB)'}
            /> 
        </Fade>
        <Fade in={uploadCollapsed}>
            <div>
                <h3 className={classes.heading}>Place samples</h3>
                <Card className={classes.usherCard}>
                    <div className={classes.usherCardInner}>
                        <strong>Using tree:</strong>
                        <TreeForm />
                        <RunButton handleRunUsher={handleRunUsher} showLoading={!(props.latestTreeDownloaded && newSamplesReady)}/>
                    </div>
                </Card>
            </div>
        </Fade>
        <Fade in={showResults}>
            <div>
                <h3 classname={classes.heading}>View Results</h3>
                <Card className={classes.resultsCardInner}>
                    <UsherProgress value={currentSample/5 * 100} currentSample={currentSample}/>
                </Card>
            </div>
        </Fade>
        
        </div>
    );
}

export default UsherFrame;