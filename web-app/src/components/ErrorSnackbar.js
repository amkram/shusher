import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

/* A generic error notification */

const useStyles = makeStyles((theme) => ({
  alert: {
    fontSize: "12pt",
  },
}));

export default function ErrorSnackbar(props) {
  const classes = useStyles();

  return (
    <Snackbar
      open={props.open}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={props.onClose}
    >
      <Alert className={classes.alert} severity="error">
        {props.text}
      </Alert>
    </Snackbar>
  );
}
