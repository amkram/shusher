import './App.css';
import DataInput from './components/DataInput'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';


const useStyles = makeStyles((theme) => ({
  root: {
  },
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'block'
  },
  usherBox: {
    margin: '0 auto',
    width: '75%',
    maxWidth: '1000px',
    backgroundColor: '#f5f7f1'
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className="logo">
        <img className="logo-img" src="img/logo.png" alt="UShER logo"/>
      </div>
      <div className={classes.wrapper}>
        <Box className={classes.usherBox}>
          <DataInput/>
        </Box>
      </div>

    </div>
  );
}

export default App;
