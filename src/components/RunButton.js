import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
	button: {
		backgroundColor: '#eee',
		textTransform: 'none',
		marginTop: '-8px',
		height: '40px'
	},
	usherText: {
		textShadow: '1px 1px #aaa',
		color: '#5c0404',
		fontWeight: 'bold',
	}
  }));


function RunButton() {
	const classes = useStyles();

	return (
	<Button className={classes.button}
		variant="contained" component="label">
		Run&nbsp;<span className={classes.usherText}>UShER</span>
	</Button>);
}

export default RunButton;