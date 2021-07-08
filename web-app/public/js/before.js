/* This file is loaded before the Usher JS (in src/pages/App.js)
 * It creates a Module object which will be used by emscripten 
 * (see public/js/usher.js). The locateFile function tells emscripten
 * where to find the usher data files instead of the web root.
 */

Module = {};
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
  