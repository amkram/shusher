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
		  defaultValue={1000}
		  className={classes.formControl}
          InputLabelProps={{
            shrink: true,
          }}
		  onChange={e => props.setValue(e.target.value)}

        />
	</div>
	);
}

export default SubtreeForm;