import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

/* Display a spinning animation while the file loads. */

export default function ProcessingFile(props) {
  return (
    <div>
      Processing file... <br />
      (your data will not leave your computer) <br />
      <CircularProgress />
    </div>
  );
}
