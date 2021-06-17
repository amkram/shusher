import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

export default function UsherProgress(props) {
	return (
		<div style={{ padding: '5%' }}>
		<Grid container spacing={1}>
			<Grid item xs={12}>
				<Box display="flex" alignItems="center">
					<br />
					UShER is running! <br />
					Please be patient. This may take over a minute per sample.
				</Box>
			</Grid>
			<Grid item xs={10}>
				<Box width="100%" mr={1}>
					<br/>
					<LinearProgress variant="determinate" {...props} />
				</Box>
			</Grid>
			<Grid item xs={2}>
				<Box minWidth={30} style={{marginTop: '14px'}}>
					<Typography variant="body2" color="textSecondary">{`${props.currentStage.message}`}</Typography>
				</Box>
			</Grid>
		</Grid>
		</div>
	  );
  }