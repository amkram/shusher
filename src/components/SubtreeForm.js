import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles((theme) => ({
	formControl: {
	  margin: theme.spacing(1),
	  minWidth: 120,
	  marginTop: -4,
	}
  }));


function SubtreeForm(props) {
	const classes = useStyles();

	
	return (
	<div>
        <TextField
          id="standard-number"
          type="number"
		  className={classes.formControl}
          InputLabelProps={{
            shrink: true,
          }}
        />
	</div>
	);
}

export default SubtreeForm;