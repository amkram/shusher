import React, {useEffect} from 'react'
import Box from '@material-ui/core/Box';
import DataInput from '../components/DataInput'
import { withStyles } from '@material-ui/core/styles'
import { showTree } from '../tools/auspice/showTree.js'
import '../styles/global.css'


const styles = theme => ({
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
	}
});

class App extends React.Component {
	constructor(props) {
		super(props);		
		this.state = {
			usherLoaded: false,
			treeVisible: false
		};
	}
	

 	testViz() {
		if (!this.treeVisible) {
			console.log('Showing auspice JSON.')
		//	showTree(this.props.dispatch, File(window.FS.readFile('/zika.json', 'utf8')));
			this.setState({treeVisible: true})
		}
	}
	
	componentDidMount() {
		// Load the UShER Emscripten bundle and global JS
		if (!this.state.usherLoaded) {
			const usherJS = document.createElement('script');
			const toolsJS = document.createElement('script');
			usherJS.src = '/dist/js/usher.js';
			toolsJS.src = '/dist/js/tools.js';
			usherJS.async = true;
			toolsJS.async = true;
			document.body.appendChild(usherJS);
			usherJS.onload = () => { document.body.appendChild(toolsJS); };
			toolsJS.onload = () => { this.testViz(); }
			//window.saveFileFromURL('/latest_tree.pb', 'https://hgwdev.gi.ucsc.edu/~angie/UShER_SARS-CoV-2/public-latest.all.masked.pb'); 
			this.setState({usherLoaded: true});
			console.log("Usher JS loaded.");
		}
	}


	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<div className="logo">
					<img className={classes.logoImg} src="/dist/img/logo.png" alt="UShER logo"/>
					<Box className={classes.usherBox}>
						<DataInput/>
					</Box>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(App);