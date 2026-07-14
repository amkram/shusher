import React from "react";
import Alert from "@material-ui/lab/Alert";

/**
 * Banner recommending Firefox. Placing samples loads the multi-gigabyte
 * global tree into WebAssembly memory, which Chromium-based browsers
 * currently fail to allocate (the UShER worker aborts). Firefox handles it,
 * so we steer users there.
 */
export default function BrowserWarning() {
  return (
    <Alert
      severity="warning"
      style={{
        justifyContent: "center",
        borderRadius: 0,
        fontSize: 15,
      }}
    >
      For best results, please use{" "}
      <a
        href="https://www.mozilla.org/firefox/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontWeight: "bold", color: "inherit" }}
      >
        Firefox
      </a>
      . Other browsers (such as Chrome and Safari) may run out of memory while
      loading the global tree.
    </Alert>
  );
}
