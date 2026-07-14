import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

/**
 * Shown while the global tree is downloading (see App.js). The tree is a
 * large file, so this gives the user feedback that something is happening.
 * When the server reports a Content-Length the bar tracks the real download
 * progress; otherwise it falls back to an indeterminate bar.
 */
export default function TreeDownloadProgress(props) {
  const { progress } = props;
  const hasProgress = typeof progress === "number" && progress > 0;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      style={{ margin: "0 auto 20px", maxWidth: "480px" }}
    >
      <Typography variant="body2" style={{ marginBottom: "8px" }}>
        Downloading tree (takes up to 3 min)&hellip;
      </Typography>
      <Box display="flex" alignItems="center" width="100%">
        <Box width="100%" mr={1}>
          <LinearProgress
            variant={hasProgress ? "determinate" : "indeterminate"}
            value={hasProgress ? Math.min(progress, 100) : undefined}
          />
        </Box>
        {hasProgress && (
          <Box minWidth={35}>
            <Typography variant="body2" color="textSecondary">
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
