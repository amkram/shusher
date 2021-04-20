import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FileDrop } from 'react-file-drop';
import FileUploader from './FileUploader';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        height: '180px',
        width: '25vw',
        margin: '0 auto',
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
        zIndex: '1',
        opacity: '0'
    },
    fileDropDraggingFrame: {
        backgroundColor: '#eeeeee',
        borderRadius: '6px',
        boxShadow: '0px 0px 4px 1px #ddd inset',
    },
    fileDropDraggingTarget: {
        backgroundColor: '#f3fff2',
        borderRadius: '6px',
        boxShadow: '0px 0px 4px 1px #ddd inset',
    },
    heading: {
        textAlign: 'center',
        paddingTop: '5%'
    },
    overlay: {
        position: 'relative',
        top: '-180px',        
        textAlign: 'center',
        
    },
    fileIcon: {
        width: '50px',
        opacity: 0.5
    }
  }));

function DataInput() {
    const classes = useStyles();

    return (
        <div>
        <h3 className={classes.heading}>Load your data</h3>
        <div className={classes.wrapper}>
            
            <FileDrop
                className={classes.fileDrop}
                targetClassName={classes.fileDropTarget}
                draggingOverFrameClassName={classes.fileDropDraggingFrame}
                draggingOverTargetClassName={classes.fileDropDraggingTarget}
            />
            <div className={classes.overlay}>
                <p>Drag a file here</p>
                <img src="img/icon-file-light.png" className={classes.fileIcon}/>
                <p>or&nbsp; <FileUploader /> </p>
            </div>
            </div>
        </div>
    );
}

export default DataInput;