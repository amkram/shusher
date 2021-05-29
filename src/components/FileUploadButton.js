import React from 'react';
import Button from '@material-ui/core/Button';

function FileUploadButton(props) {
    function handleUpload(event) {
      props.callback(event.target.files[0]);
    }

    return <Button
        variant="contained"
        component="label"
        data={3}
        >
        Choose File
        <input type="file" onChange={handleUpload} hidden />

    </Button>

}

export default FileUploadButton;

