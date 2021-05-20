import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
	formControl: {
	  margin: theme.spacing(1),
	  minWidth: 120,
	  marginTop: -4
	},
  }));


function TreeForm(props) {
	const classes = useStyles();

	
	return (
	<div>
		<FormControl className={classes.formControl}>
			<Select value={1}>
			<MenuItem value={1}>Latest SARS-CoV-2</MenuItem>
			</Select>
		</FormControl>
	</div>
	);
}

export default TreeForm;