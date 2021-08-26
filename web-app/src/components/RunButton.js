import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

/**
 * The "Run UShER" button. It displays a loading animation until
 * UShER is ready to run (see UsherFrame.js)
 */

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: "#eee",
    textTransform: "none",
    height: "40px",
    width: "110px",
    top: "12px",
  },
  usherText: {
    textShadow: "1px 1px #aaa",
    color: "#5c0404",
    fontWeight: "bold",
  },
}));

export default function RunButton(props) {
  const classes = useStyles();

  return (
    <div>
      <Button
        className={classes.button}
        variant="contained"
        component="label"
        onClick={props.handleRunUsher}
      >
        {props.showLoading ? (
          <CircularProgress size={"35%"} />
        ) : (
          <span>
            Run&nbsp;<span className={classes.usherText}>UShER</span>
          </span>
        )}
      </Button>
    </div>
  );
}