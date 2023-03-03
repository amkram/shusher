import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

/* Dropdown menu to select existing tree to place samples on. Only SARS-CoV-2 for now. */

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginTop: -4,
  },
}));

export default function TreeForm(props) {
  const classes = useStyles();
  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select value={1}>
          <MenuItem value={1}>Global SARS-CoV-2</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
