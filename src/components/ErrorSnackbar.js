import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

export default function ErrorSnackbar(props) {

  const handleClose = () => {
	props.handleClose();
  }

  return (
      <Snackbar
	  	open={props.open}
		autoHideDuration={5000}
        anchorOrigin={ {vertical: 'top', horizontal: 'right'} }
		onClose={props.onClose}
      >
	  <Alert severity="error">{props.text}</Alert>
	  </Snackbar>
    
  );
}