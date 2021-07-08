import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
	button: {
		backgroundColor: '#dadfed',
		textTransform: 'none',
		height: '25px',
		width: '100px',
	},
  }));


function SubtreeButton(props) {
	const classes = useStyles();

	return (
		<div>
			<Button className={classes.button}
				variant="contained" component="label" onClick={() => props.openInAuspice(props.subtree)}>
				View Subtree {props.subtree}
			</Button>
			
		</div>
	);
}

export default SubtreeButton;