import React from "react";
import Box from "@material-ui/core/Box";
import UsherFrame from "../components/UsherFrame";
import { withStyles } from "@material-ui/core/styles";
import { latestTreeUrl } from "../data/constants";
import { showTreeFromJson } from "../tools/auspice/showTree";
import packageJson from "../../package.json";
import "../styles/global.css";

/**
 * The top-level app component. It contains logic to render either
 * ShUShER or Auspice depending on the browser route.
 */

const styles = () => ({
  root: {
    textAlign: "center",
    margin: 0,
    fontFamily: "Inter, Helvetica, sans-serif",
    fontSize: 16,
    backgroundColor: "#f5f7f1",
  },
  wrapper: {
    width: "100%",
    height: "100%",
    display: "block",
  },
  usherBox: {
    margin: "0 auto",
    width: "75%",
    maxWidth: "1000px",
    backgroundColor: "#f5f7f1",
  },
  auspice: {
    width: "500px",
    height: "500px",
  },
  logoImg: {
    height: "100px",
    margin: "0 auto",
    marginTop: "30px",
    display: "block",
  },
  logo: {
    width: "310px",
    margin: "0 auto",
  },
  logoP: {
    textAlign: "right",
    fontWeight: "600",
    marginTop: "0px",
    marginRight: "15px",
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usherLoaded: false,
      treeVisible: false,
      latestTreeDownloaded: false,
      jsReady: false,
    };
  }

  checkJS = () => {
    if (typeof window.Module.asm !== "undefined") {
      this.setState({ jsReady: true });
    }
  };
  /* Called once when the app loads.
   * Depending on the route, it will load the usher main app
   * or a subtree in auspice. If loading auspice, subtree data
   * that has been saved during the UShER run is pulled from
   * localStorage to avoid sending data over the Internet.
   */
  componentDidMount() {
    if (location.href.split("subtree/").length == 2) {
      // the current page should display a subtree in auspice
      var split = location.href.split("subtree/")[1].split("/");
      // handles the case the user has multiple usher tabs open
      var originatingWindow = split[0];
      var loadSubtreeNum = parseInt(split[1]) - 1;
      var loadedJson = JSON.parse(
        window.localStorage.getItem(originatingWindow)
      )[loadSubtreeNum];
      console.log("loading previously stored subtree #" + loadSubtreeNum);
      console.log(loadedJson);

	  // Load auspice
      showTreeFromJson(this.props.dispatch, loadedJson);

	} else if (!this.state.usherLoaded) {
      // The current page should load usher

      // Load the UShER Emscripten bundle and global JS
      const beforeJS = document.createElement("script");
      const usherJS = document.createElement("script");
      const afterJS = document.createElement("script");
      beforeJS.src = "/dist/js/before.js";
      usherJS.src = "/dist/js/usher.js";
      afterJS.src = "/dist/js/after.js";
      beforeJS.async = true;
      usherJS.async = true;
      afterJS.async = true;
      document.body.appendChild(beforeJS);

      // Ensure script ordering
      beforeJS.onload = () => {
        document.body.appendChild(usherJS);
      };
      usherJS.onload = () => {
        document.body.appendChild(afterJS);
      };
      afterJS.onload = () => {
        console.log("Usher JS loaded.");
        this.setState({ usherLoaded: true });
        window.setInterval(this.checkJS, 100);
        var mimeType = "application/octet-stream";

		// Download the latest global tree
        window
          .saveFileFromUrl("/latest_tree.pb.gz", latestTreeUrl, mimeType)
          .then(() => {
            this.setState({ latestTreeDownloaded: true });
          });
      };

      // Prevent loading file in browser upon drag-and-drop
      window.addEventListener(
        "dragover",
        function (e) {
          e = e || event;
          e.preventDefault();
        },
        false
      );
      window.addEventListener(
        "drop",
        function (e) {
          e = e || event;
          e.preventDefault();
        },
        false
      );

      window.addEventListener("beforeunload", this.confirmClosePage);
      window.addEventListener("unload", this.handleClosePage);
      window.onerror = function (error, url, line) {
        console.log("error:");
        console.log(error);
      };
    }
  }

  confirmClosePage = (event) => {
    event.preventDefault();
    event.returnValue = "";
  };
  handleClosePage = () => {
    if (window.id) {
      window.localStorage.removeItem(window.id);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div>
          <div className={classes.logo}>
            <img
              className={classes.logoImg}
              src="/dist/img/logo.png"
              alt="UShER logo"
            />
            <p className={classes.logoP}>
              <em>v{packageJson.version}</em>
            </p>
          </div>
          <Box className={classes.usherBox}>
            <UsherFrame
              returned={this.state.returned}
              latestTreeDownloaded={this.state.latestTreeDownloaded}
              jsReady={this.state.jsReady}
            />
          </Box>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
