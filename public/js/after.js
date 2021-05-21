/* This file is loaded after the Usher JS. It's loaded into the document via src/pages/App.js
 * It binds some functions to the global 'window' so we can access them from React components.
 */
window.saveFileFromURL = (path, url) => {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (this.responseText.length < 2000000) {
                console.log('Error fetching latest tree.')
            } else {
                console.log('Saved tree');
                FS.writeFile(path, this.responseText);    
                window.treeReady = true;
             }
        }
    }
    req.overrideMimeType( "text/plain; charset=x-user-defined" );
    req.open('GET', url, true);
    req.send();
};

// use 'window' as a global variable that we can access in React.
// Emscripten filesystem access and running usher will be called through this global.
window.FS = FS;
window.callMain = callMain;
window.Module = Module;
window.usher_err = '';
window.usher_output = '';
window.treeReady = false;