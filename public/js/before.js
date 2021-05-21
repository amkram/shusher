/* This file is loaded before the Usher JS. It's loaded into the document via src/pages/App.js
 * It tells the emscripten Module where to find the Usher wasm/data files
 */
Module['locateFile'] = ((path, prefix) => {
    console.log('calling locateFile with path: ' + path);
    if (path == "usher.data") {
        return "/dist/js/usher.data";
    } else if (path == "usher.worker.js") {
        return "/dist/js/usher.worker.js";
    } else if (path == "usher.wasm") {
        return "/dist/js/usher.wasm";
    }
});
  