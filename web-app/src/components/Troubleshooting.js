import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

export default function Troubleshooting(props) {
  return (
    <div style={{ padding: "5%", paddingTop: 0, paddingLeft: 0}}>
          <Box>
             <h5 style={{textDecoration: "underline", textAlign: "center"}}> Troubleshooting</h5>
                <ul>
                    <li>The global tree is very large, and always growing. Make sure you have ~4GB of free RAM.</li>
                    <li>If you are experiencing very slow runtime (several minutes per sample), try closing your browser completely (all windows) and try again.</li>
                </ul>
          </Box>
    </div>
  );
}
