import React from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    tooltip: {
      maxWidth: '30px',
      fontSize: '12pt',
       margin: "4px 0",
    },
  }));

export default function InfoTooltip(props) {
  const classes = useStyles();

  return (
    <div>
      <Tooltip TransitionComponent={Zoom} title={<span style={{ fontSize: "12pt", lineHeight: '1.5em' }}> {props.text} </span>} className={classes.tooltip}>
        <HelpOutlineIcon />
      </Tooltip>
    </div>
  );
}