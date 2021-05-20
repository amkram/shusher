import React, {useEffect} from 'react'
import Box from '@material-ui/core/Box';
import DataInput from '../components/DataInput'
import { makeStyles } from '@material-ui/core/styles';
import ScriptTag from 'react-script-tag'
import '../styles/global.css'



export default function App() {
	const [usherLoaded, setUsherLoaded] = React.useState(false);

	const useStyles = makeStyles((theme) => ({
		root: {
			textAlign: 'center',
			margin: 0,
			fontFamily: 'Inter, Helvetica, sans-serif',
			backgroundColor: '#f5f7f1'
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
		auspice: {
			width: '500px',
			height: '500px'
		},
		logoImg: {
			height: '100px',
			margin: '0 auto',
			marginTop: '30px',
			display: 'block'
		},
		
	}));
	const classes = useStyles();
	function testViz() {
		console.log('hi');
	}
	
	useEffect(() => {
			window.saveFileFromURL('/latest_tree.pb', 'https://hgwdev.gi.ucsc.edu/~angie/UShER_SARS-CoV-2/public-latest.all.masked.pb'); 
		testViz();
	})

	function handleUsherLoaded() {
		console.log("Usher JS loaded successfully.");
		if (!usherLoaded) {
			setUsherLoaded(true);
		}
	}

	return (
		<div className={classes.root}>
		<ScriptTag type="text/javascript" src="js/usher.js" onLoad={handleUsherLoaded()} />
		<div className="logo">
		<img className={classes.logoImg} src="img/logo.png" alt="UShER logo"/>
		<Box className={classes.usherBox}>
			<DataInput/>
		</Box>
		</div>
	</div>
	)
}
