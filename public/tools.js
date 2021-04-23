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

// use 'window' as a global usable in React components
window.FS = FS;
window.callMain = callMain;
window.Module = Module;

window.usher_err = '';
window.usher_output = '';

window.treeReady = false;
