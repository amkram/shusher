import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';



export default function ConfirmationDialog(props) {



  const handleOk = () => {
    props.onClose();
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      open={props.open}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent dividers>
      {props.text}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}