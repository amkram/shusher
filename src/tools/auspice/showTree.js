// Adapted from auspice.us
// https://github.com/nextstrain/auspice.us

import { createStateFromQueryOrJSONs } from "auspice/src/actions/recomputeReduxState";
import { errorNotification } from "auspice/src/actions/notifications";


export const showTree = (dispatch, file) => {

  const fileReader = new window.FileReader();
  fileReader.onloadstart = () => {
    console.log(`Reading file ${file.name}`);
  }
  fileReader.onload = (event) => {
    let state;
    try {
      let json;
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith("json")) {
        console.log("Parsing dropped file as Auspice v2 JSON");
        json = JSON.parse(event.target.result);
      } else {
        throw new Error("Not a JSON file.");
      }
      state = createStateFromQueryOrJSONs({json: json, query: {}});
    } catch (err) {
      return dispatch(errorNotification({
        message: `attempted to read this file but failed!`,
        details: `Error message: ${err.message}`
      }));
    }

    // Load the (parsed) tree data into redux store
    dispatch({type: "CLEAN_START", ...state});
    // Load the "main" page, otherwise we'll always be seeing the splash page!
    dispatch({type: "PAGE_CHANGE", displayComponent: "main"});
  }
  fileReader.onerror = (err) => {
    return dispatch(errorNotification({
      message: `attempted to parse this file but failed!`,
      details: `Error message: ${err.message}`
    }));
  };
  fileReader.readAsText(file)
};
