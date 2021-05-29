import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function ProcessingFile(props) {
	return (
	  <div>
          Processing uploaded file... <br/>
			<CircularProgress />
	  </div>
	);
  }