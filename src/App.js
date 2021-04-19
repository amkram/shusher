import logo from './logo.svg';
import './App.css';
import Slider from './components/Slider'
import { makeStyles } from '@material-ui/core/styles';
import { sizing } from '@material-ui/system';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Box } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '75%',
    marginLeft: '12.5%',
    marginTop: '30px',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <img class="logo" src="img/logo.png"/>
        <Paper>
          Hello<br/>
          <Slider/>
        </Paper>

    </div>
  );
}

export default App;
