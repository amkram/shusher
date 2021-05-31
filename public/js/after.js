/* This file is loaded after the Usher JS. It's loaded into the document via src/pages/App.js
 * It binds some functions to the global 'window' so we can access them from React components.
 */

window.saveFileFromUrl = function(path, url, mimeType) {
    var req = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                var arrayBuffer = req.response;
                console.log('Saved ' + url + ' to ' + path);
                FS.writeFile(path, new Uint8Array(arrayBuffer));
                resolve();
            }
        } 
//        req.overrideMimeType(mimeType);
        req.open('GET', url, true);
        req.responseType = "arraybuffer";
        req.send();
    });
};
// use 'window' as a global variable that we can access in React.
// Emscripten filesystem access and running usher will be called through this global.
window.FS = FS;
window.callMain = callMain;
window.Module = Module;
window.usher_err = '';
window.usher_output = '';