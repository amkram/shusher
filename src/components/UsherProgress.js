import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export default function UsherProgress(props) {
	return (
	  <div>
		  UShER is running!<br />
		  Please be patient, this may take over 30 seconds per sample. <br />
		  	<Box position="relative" display="inline-flex">
			<CircularProgress variant="determinate" {...props} />
			<Box
			top={0}
			left={0}
			bottom={0}
			right={0}
			position="absolute"
			display="flex"
			alignItems="center"
			justifyContent="center"
			>
			<Typography variant="caption" component="div" color="textSecondary">{`${props.currentSample}/5`}</Typography>
			</Box>
	  </Box>
	  </div>
	);
  }