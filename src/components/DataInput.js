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
        margin: '0 auto'
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
        marginTop: '4vh'
    },
  }));

function DataInput() {
    const classes = useStyles();
    const [loaderOpen, setCollapsed] = React.useState(false);

    const handleChange = () => {
        setCollapsed((prev) => !prev);
    };

    const handleDelete = () => {
        handleChange();
    };

    return (
        <div className={classes.root}>
        <h3 className={classes.heading}>Load your data</h3>
        
        <Collapse in={loaderOpen}>
        <div className={classes.wrapper}>

            <FileDrop
                className={classes.fileDrop}
                targetClassName={classes.fileDropTarget}
                draggingOverFrameClassName={classes.fileDropDraggingFrame}
            />
            <div className={classes.overlay}>
                <p>Drag a FASTA or VCF file here</p>
                <img src="img/icon-file-light.png" className={classes.fileIcon}/>
                <p>or&nbsp; <FileUploader /> </p>
            </div>
        </div>

        </Collapse>

        <Fade in={!loaderOpen}>
            <Chip 
                className={classes.loadedFileChip}
                onDelete={handleDelete}
                icon={<img src="img/icon-file-light.png" width='20px'/>}
                label='This_is_a_filename.fasta (10.3 MB)'
            /> 
        </Fade>
        <Fade in={!loaderOpen}>
            <div>
                <h3 className={classes.heading}>Place samples</h3>
                <Card className={classes.usherCard}>
                    <div className={classes.usherCardInner}>
                        <strong>Using tree:</strong>
                        <TreeForm />
                        <RunButton />
                    </div>
                </Card>
            </div>
        </Fade>
        
        </div>
    );
}

export default DataInput;