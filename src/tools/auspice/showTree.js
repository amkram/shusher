// Adapted from auspice.us
// https://github.com/nextstrain/auspice.us

import { createStateFromQueryOrJSONs } from "auspice/src/actions/recomputeReduxState";
import { errorNotification } from "auspice/src/actions/notifications";
import { newickToAuspiceJson } from "../../vendor/auspice.us/parseNewick";

/* The following requires knowledge of how auspice works, is undocumented, and is liable to change since auspice
doesn't officially expose these functions */


// Displays an auspice tree given a newick or json file
export const showTreeFromFile = (dispatch, file, userSamples) => {
  const fileReader = new window.FileReader();
  fileReader.onloadstart = () => {
    console.log(`Reading file ${file.name}`);
  }
  fileReader.onload = (event) => {
    let state;
    try {
      let json;
      const fileName = file.name.toLowerCase();
      console.log(fileName);
      if (fileName.endsWith("json")) {
        console.log("Parsing file as Auspice v2 JSON");
        json = JSON.parse(event.target.result);
      } else if (fileName.endsWith("nh")) {
        console.log("Parsing file as a newick tree with branch lengths of divergence");
        console.log('hello');
        console.log(file.name + ' ' + event.target.result + ' ' + userSamples);
        json = newickToAuspiceJson(file.name, event.target.result, userSamples);
      } else {
        throw new Error("Parser for this file type not (yet) implemented");
      }
      state = createStateFromQueryOrJSONs({json: json, query: {}});
    } catch (err) {
      return dispatch(errorNotification({
        message: `attempted to read this file but failed!` + err
      }));
    }

    // Load the (parsed) tree data into redux store
    dispatch({type: "CLEAN_START", ...state});
    // Load the "main" page, otherwise we'll always be seeing the splash page!
    dispatch({type: "PAGE_CHANGE", displayComponent: "main",  pushState: true});
  }
  fileReader.onerror = (err) => {
    return dispatch(errorNotification({
      message: `attempted to parse this file but failed!`
    }));
  };
  fileReader.readAsText(file)
};

// Displays an auspice tree given a json string
export const showTreeFromJson = (dispatch, json) => {
  console.log('showing tree from json')
  try {
    state = createStateFromQueryOrJSONs({json: json, query: {}});
  } catch (err) {
    return dispatch(errorNotification({
      message: `attempted to read this file but failed!` + err
    }));
  }

  // Load the (parsed) tree data into redux store
  dispatch({type: "CLEAN_START", ...state});
  // Load the "main" page, otherwise we'll always be seeing the splash page!
  dispatch({type: "PAGE_CHANGE", displayComponent: "main"});

}

// Converts a file to auspice json and returns it
export const getTreeJson = (file, userSamples, num) => {
  var fileText = FS.readFile('/' + file.name, {encoding: 'utf8'});
  console.log(fileText);
 // const fileReader = new window.FileReader();
  
 // fileReader.onload = function(e) {
    let state;
    try {
      var json;
      const fileName = file.name.toLowerCase();
      console.log(fileName);
      if (fileName.endsWith("json")) {
        console.log("Parsing file as Auspice v2 JSON");
        json = JSON.parse(fileText);
      } else if (fileName.endsWith("nh")) {
        console.log("Parsing file as a newick tree with branch lengths of divergence");
        json = newickToAuspiceJson(file.name, fileText, userSamples);
        console.log(json);
        return json;
  
      } else {
        throw new Error("Parser for this file type not (yet) implemented");
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  
  //}


  //fileReader.readAsText(file);
  
}