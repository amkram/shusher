window.saveFileFromURL = (path, url) => {
	
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (this.responseText.length < 2000000) {
                window.downloaded = false;
                console.log('Error fetching latest tree.')
            } else {
                console.log('Saved tree');
                FS.writeFile(path, this.responseText);
                window.downloaded = true;
             }
        }
    }
    req.overrideMimeType( "text/plain; charset=x-user-defined" );
    req.open('GET', url, true);
    req.send();

  };

