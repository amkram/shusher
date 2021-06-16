import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

export default function UsherProgress(props) {
	return (
		<Grid container spacing={3}>
			<Box display="flex" alignItems="center">
				<br />
				UShER is running! <br />
				Please be patient. This may take over a minute per sample.
			</Box>

			<Box width="80%" mr={1}>
				<br/>
				<LinearProgress variant="determinate" {...props} />
			</Box>
			<Box minWidth={35}>
				<Typography variant="body2" color="textSecondary">{`${props.currentStage.message}`}</Typography>
			</Box>
		</Grid>
	  );
  }