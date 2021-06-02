import React, {useEffect} from 'react'
import Box from '@material-ui/core/Box';
import UsherFrame from '../components/UsherFrame'
import { withStyles } from '@material-ui/core/styles'
import { showTree } from '../tools/auspice/showTree'
import { latestTreeUrl } from '../data/constants'
import { fastaToVcf } from '../tools/alignment/fastaToVcf'

import '../styles/global.css'


const styles = theme => ({
	root: {
		textAlign: 'center',
		margin: 0,
		fontFamily: 'Inter, Helvetica, sans-serif',
		fontSize: 16,
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
			treeVisible: false,
			latestTreeDownloaded: false
		};
		this.showTreeWrapper = this.showTreeWrapper.bind(this);
	}
	
	showTreeWrapper(filename) {
		console.log("showTreeWrapper in App.js");
		var file = new File([window.FS.readFile('/' + filename, {encoding: 'utf8'})],
						"subtree.nh", { type: "text/plain"});
		showTree(this.props.dispatch, file);
	}

	testAlign() {
		fastaToVcf();
	}
	
	componentDidMount() {
		if (!this.state.usherLoaded) {
	
			// Load the UShER Emscripten bundle and global JS
			const beforeJS = document.createElement('script');
			const usherJS = document.createElement('script');
			const afterJS = document.createElement('script');
			beforeJS.src = '/dist/js/before.js';
			usherJS.src = '/dist/js/usher.js';
			afterJS.src = '/dist/js/after.js';
			beforeJS.async = true;
			usherJS.async = true;
			afterJS.async = true;
			document.body.appendChild(beforeJS);
			
			// Ensure script ordering
			beforeJS.onload = () => { document.body.appendChild(usherJS); };
			usherJS.onload = () => { document.body.appendChild(afterJS); };
			afterJS.onload = () => { 
				console.log("Usher JS loaded.");
				this.setState({usherLoaded: true});
				var mimeType = 'application/octet-stream';
				window.saveFileFromUrl('/latest_tree.pb.gz', latestTreeUrl, mimeType)
					.then(() => {
						this.setState({latestTreeDownloaded: true})
					});
				
			}

			// Prevent loading file in browser upon drag-and-drop
			window.addEventListener("dragover",function(e){
				e = e || event;
				e.preventDefault();
			  },false);
			  window.addEventListener("drop",function(e){
				e = e || event;
				e.preventDefault();
			  },false);
		}				
	}
	

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<div className="logo">
					<img className={classes.logoImg} src="/dist/img/logo.png" alt="UShER logo"/>
					<Box className={classes.usherBox}>
						<UsherFrame latestTreeDownloaded={this.state.latestTreeDownloaded} showTreeWrapper={this.showTreeWrapper}/>
					</Box>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(App);