// Adapted from auspice.us
// https://github.com/nextstrain/auspice.us
import { createStateFromQueryOrJSONs } from "@auspice/actions/recomputeReduxState";
import { errorNotification } from "@auspice/actions/notifications";
import newickToAuspiceJson from "./parseNewick";

export const showTree = (dispatch, files) => {

    const file = files[0];
 
    let state;
    try {
      let json;
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith("json")) {
        console.log("Parsing dropped file as Auspice v2 JSON");
        json = JSON.parse(event.target.result);
      } else if (fileName.endsWith("new") || fileName.endsWith("nwk") || fileName.endsWith("newick")) {
        console.log("Parsing dropped file as a newick tree with branch lengths of divergence");
        json = newickToAuspiceJson(file.name, event.target.result);
      } else {
        throw new Error("Parser for this file type not (yet) implemented");
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
