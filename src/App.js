import './App.css';
import DataInput from './components/DataInput'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles((theme) => ({
  root: {
  },
  paperWrapper: {
    width: '100%',
    height: '100%',
    display: 'block'
  },
  usherPaper: {
    margin: '0 auto',
    marginTop: '30px',
    width: '75%',
    maxWidth: '1000px',
    height: '55vh'
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className="logo">
        <img className="logo-img" src="img/logo.png" alt="UShER logo"/>
      </div>
      <div className={classes.paperWrapper}>
        <Paper className={classes.usherPaper}>
          <DataInput/>
        </Paper>
      </div>

    </div>
  );
}

export default App;
