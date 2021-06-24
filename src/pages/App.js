import React, {useEffect} from 'react'
import Box from '@material-ui/core/Box';
import UsherFrame from '../components/UsherFrame'
import { withStyles } from '@material-ui/core/styles'
import { showTree } from '../tools/auspice/showTree'
import { latestTreeUrl } from '../data/constants'
import { fastaToVcf } from '../tools/alignment/fastaToVcf'
import { createStateFromQueryOrJSONs } from "auspice/src/actions/recomputeReduxState";
import { errorNotification } from "auspice/src/actions/notifications";
import { showTreeFromJson } from '../tools/auspice/showTree';

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
			latestTreeDownloaded: false,
		};
	}
	

	// listenForBack() {
	// 	if (window.goBack) {
	// 		console.log('back button received in App.js')
	// 		window.goBack = false;
	// 		window.returned = true;
	// 		this.props.dispatch({type: "PAGE_CHANGE", displayComponent: "splash", pushState: true});
	// 	}
	// }
	
	componentDidMount() {
		if (location.href.split('subtree/').length == 2) {
			// the current page should display a subtree in auspice
			var loadSubtreeNum = parseInt(location.href.split('subtree/')[1]);
			var loadedJson = JSON.parse(window.localStorage.getItem('window0'))[loadSubtreeNum];
			console.log('loading previously stored json subtree #' + loadSubtreeNum);
			console.log(loadedJson);
			showTreeFromJson(loadedJson);
			console.log('done showing tree')
		}
		else if (!this.state.usherLoaded) {
			// the current page should load usher

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

					  let state;
					  try {
						let json;
						json = JSON.parse('{"version":"2.0","meta":{"title":"subtree-1.nh","panels":["tree"],"description":"  Dataset generated on Tue, Jun 22, 2021.  If you have metadata you wish to display, you can now drag on a CSV file and it will be added into this view,  [see here](https://nextstrain.github.io/auspice/advanced-functionality/drag-drop-csv-tsv) for more info.  ","colorings":[{"key":"type","title":"Sample category","type":"categorical","scale":[["Your samples","#3d74ff"],["Existing samples","#e3e3e3"]]}],"filters":["type"]},"tree":{"children":[{"name":"CHN/YN-0306-466/2020|MT396241.1|2020-03-06","node_attrs":{"div":1,"type":{"value": "Existing samples"}}},{"name":"2","children":[{"name":"USA/CA-QDX-1028/2020|MW064993.1|2020-03-16","node_attrs":{"div":1,"type":{"value": "Existing samples"}}},{"name":"USA/CA-QDX-1029/2020|MW064994.1|2020-03-17","node_attrs":{"div":1,"type":{"value": "Existing samples"}}}],"node_attrs":{"div":1,"type":{"value": "Existing samples"}}},{"name":"DP0803|LC571037.1|2020-02-17","node_attrs":{"div":1,"type":{"value": "Existing samples"}}},{"name":"3","children":[{"name":"England/SHEF-C06CE/2020|2020-03-25","node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"England/LEED-2A8B52/2020|OA971832.1|2020-04-04","node_attrs":{"div":3,"type":{"value": "Existing samples"}}}],"node_attrs":{"div":1,"type":{"value": "Existing samples"}}},{"name":"4","children":[{"name":"England/SHEF-BFFC7/2020|2020-03-25","node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"England/PHEC-1E01E/2020|2020-04-03","node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"England/NOTT-10DFD8/2020|2020-03-16","node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"5","children":[{"name":"England/SHEF-C0145/2020|2020-03-25","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"England/SHEF-C07F8/2020|2020-03-21","node_attrs":{"div":2,"type":{"value": "Existing samples"}}}],"node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"6","children":[{"name":"England/SHEF-D06E9/2020|2020-04-05","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"7","children":[{"name":"England/SHEF-CC4B9/2020|2020-04-06","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"England/SHEF-C038B/2020|2020-03-27","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"England/SHEF-D05A0/2020|2020-03-24","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"England/SHEF-D00EB/2020|2020-04-10","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"England/SHEF-CC3BC/2020|2020-03-27","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"England/SHEF-D0EF0/2020|2020-04-02","node_attrs":{"div":3,"type":{"value": "Existing samples"}}}],"node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"England/SHEF-CA0D5/2020|2020-04-02","node_attrs":{"div":4,"type":{"value": "Existing samples"}}},{"name":"England/SHEF-C086E/2020|2020-03-25","node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"England/SHEF-C4E95/2020|2020-03-22","node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"England/SHEF-C59C0/2020|2020-03-24","node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"England/SHEF-C0576/2020|2020-03-20","node_attrs":{"div":2,"type":{"value": "Existing samples"}}}],"node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"8","children":[{"name":"9","children":[{"name":"England/NOTT-10FCFD/2020|2020-04-08","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"England/NOTT-10E0F2/2020|2020-03-19","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"England/NOTT-112FFE/2020|2020-09-07","node_attrs":{"div":3,"type":{"value": "Existing samples"}}}],"node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"England/NOTT-10ED19/2020|2020-03-28","node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"England/CAMB-7473F/2020|2020-03-29","node_attrs":{"div":2,"type":{"value": "Existing samples"}}}],"node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"England/LCST-24DB383/2020|2020-04-01","node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"England/PHEC-1F43F/2020|2020-03-11","node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"England/SHEF-C9EBE/2020|2020-04-10","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"England/LCST-24DB1A7/2020|2020-04-17","node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"10","children":[{"name":"England/LIVE-9CEF0/2020|2020-04-28","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"11","children":[{"name":"England/CAMB-75B32/2020|2020-03-29","node_attrs":{"div":5,"type":{"value": "Existing samples"}}},{"name":"Wales/PHWC-2711F/2020|2020-03-29","node_attrs":{"div":4,"type":{"value": "Existing samples"}}},{"name":"12","children":[{"name":"England/LIVE-9D5CD/2020|2020-04-14","node_attrs":{"div":5,"type":{"value": "Existing samples"}}},{"name":"England/LIVE-9C86B/2020|2020-03-24","node_attrs":{"div":5,"type":{"value": "Existing samples"}}},{"name":"England/LIVE-9A96A/2020|2020-03-28","node_attrs":{"div":5,"type":{"value": "Existing samples"}}}],"node_attrs":{"div":4,"type":{"value": "Existing samples"}}},{"name":"Wales/PHWC-2762F/2020|2020-03-30","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"England/BIRM-61EC7/2020|2020-03-27","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"Wales/PHWC-2763E/2020|2020-03-30","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"Wales/PHWC-276A7/2020|2020-03-31","node_attrs":{"div":3,"type":{"value": "Existing samples"}}}],"node_attrs":{"div":3,"type":{"value": "Existing samples"}}}],"node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"England/NOTT-10F70B/2020|2020-04-04","node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"England/PHEC-2088A/2020|2020-04-08","node_attrs":{"div":2,"type":{"value": "Existing samples"}}},{"name":"England/SHEF-D10CC/2020|2020-03-24","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"England/PHEC-13D30/2020|2020-03-21","node_attrs":{"div":3,"type":{"value": "Existing samples"}}},{"name":"England/SHEF-C036D/2020|2020-03-27","node_attrs":{"div":1,"type":{"value": "Existing samples"}}},{"name":"England/PHEC-1DFE5/2020|2020-04-03","node_attrs":{"div":1,"type":{"value": "Existing samples"}}},{"name":"England/PHEC-13D5E/2020|2020-03-12","node_attrs":{"div":1,"type":{"value": "Existing samples"}}}],"node_attrs":{"div":1,"type":{"value": "Existing samples"}}},{"name":"NC_045512.2","node_attrs":{"div":0,"type":{"value": "Your samples"}}}],"name":"1","node_attrs":{"div":0,"type":{"value": "Existing samples"}}}}')
						state = createStateFromQueryOrJSONs({json: json, query: {}});
					  } catch (err) {
						return this.props.dispatch(errorNotification({
						  message: `attempted to read this file but failed!` + err
						}));
					  }
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
			
			window.setInterval(this.listenForBack, 100);
		}				
	}
	

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<div className="logo">
					<img className={classes.logoImg} src="/dist/img/logo.png" alt="UShER logo"/>
					<Box className={classes.usherBox}>
						<UsherFrame returned={this.state.returned} 
							recoveredSampleData={this.state.recoveredSampleData}
							recoveredSubtreeFiles={this.state.recoveredSubtreeFiles}
							recoveredLoadedFile={this.state.recoveredLoadedFile}
							latestTreeDownloaded={this.state.latestTreeDownloaded} 
						/>
					</Box>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(App);