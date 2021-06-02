// Adapted from auspice.us
// https://github.com/nextstrain/auspice.us

import { createStateFromQueryOrJSONs } from "auspice/src/actions/recomputeReduxState";
import { errorNotification } from "auspice/src/actions/notifications";
import newickToAuspiceJson from "../../vendor/auspice.us/parseNewick";

/* The following requires knowledge of how auspice works, is undocumented, and is liable to change since auspice
doesn't officially expose these functions */

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
        console.log("Parsing file as Auspice v2 JSON");
        json = JSON.parse(event.target.result);
      } else if (fileName.endsWith("nh")) {
        console.log("Parsing file as a newick tree with branch lengths of divergence");
        json = newickToAuspiceJson(file.name, event.target.result);
      } else {
        throw new Error("Parser for this file type not (yet) implemented");
      }
      state = createStateFromQueryOrJSONs({json: json, query: {}});
    } catch (err) {
      return dispatch(errorNotification({
        message: `attempted to read this file but failed!`
      }));
    }

    // Load the (parsed) tree data into redux store
    dispatch({type: "CLEAN_START", ...state});
    // Load the "main" page, otherwise we'll always be seeing the splash page!
    dispatch({type: "PAGE_CHANGE", displayComponent: "main"});
  }
  fileReader.onerror = (err) => {
    return dispatch(errorNotification({
      message: `attempted to parse this file but failed!`
    }));
  };
  fileReader.readAsText(file)
};