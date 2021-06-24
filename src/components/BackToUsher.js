import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const BackToUsher = (props) => {	
	return (
		
		<Typography variant="h5">
		<Button onClick={props.backToUsher}>
			Return to UShER results
		</Button>
		</Typography>
	)
}

export default BackToUsher