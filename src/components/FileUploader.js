import React from 'react';
import Button from '@material-ui/core/Button';

function FileUploader() {
return <Button
    variant="contained"
    component="label"
    >
    Choose File
    <input
        type="file"
        hidden
    />
</Button>
}

export default FileUploader;