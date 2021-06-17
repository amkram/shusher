import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '20%',
    maxWidth: '60%',
    margin: '0 auto'
  },
  button: {
    backgroundColor: '#eee',
    textTransform: 'none',
    marginTop: '-8px',
    height: '40px',
    fontSize: '10pt'
  },
  listItem: {
    fontSize: '12pt',
  }
}));

export default function SubtreeList(props) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <div>
    <List className={classes.root}>
      {[...Array(props.numSubtrees).keys()].map((value) => {
        const labelId = `checkbox-list-label-${value}`;
        return (
          <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText disableTypography id={labelId} className={classes.listItem} primary={`Subtree ${value + 1}`} />
          </ListItem>
        );
      })}
    </List>
    <Button className={classes.button} variant="contained" onClick={() => props.openInAuspice(checked[0])} component="label">
        Visualize in Auspice (Nextstrain)
    </Button>
    {/* <Button className={classes.button} variant="contained" component="label">
        Download subtree files
    </Button>
			 */}
    
    </div>
  );
}