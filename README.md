<div align="center">
  <img src="web-app/public/img/logo.png" height=100/>
</div>
<div align="center">
  <strong>Secret Ultrafast Sample placement on Existing tRees</strong>
</div>
<div align="center">
  Private, browser-based placement of genome sequences on phylogenetic trees using <a href="https://github.com/yatisht/usher">UShER</a>.
<br />
<br />

  | :computer_mouse:	Access ShUShER <a href="">here</a>! |
| --- |
</div>
<div align="center">
  <h3>
    <a href="#usage">
      Usage
    </a>
    <span> | </span>
    <a href="">
      How it works
    </a>
    <span> | </span>
    <a href="">
      Installation
    </a>
  </h3>
</div>


## Contents
- [Usage](#usage)
- [How it works](#how-it-works)
- [Installation](#installation-for-developers)


## Usage
> :warning:	This tool is intended to be used only for sequences that cannot be shared publicly. If you do not have this requirement, please use the [UShER web tool](https://genome.ucsc.edu/cgi-bin/hgPhyloPlace) and submit your sequences to an INSDC member institution (NCBI, EMBL-EBI, or DDBJ) and GISAID

## How it works

The ShUShER web app uses a ported version of UShER that can be run client-side in a web browser. The original C++ [code base]() is compiled to WebAssembly with [Emscripten]() and wrapped in a React frontend (read more about the port [here]()). User-provided samples are not transmitted across the Internet, and computation is performed locally in the browser. We use a modified version of [Auspice]() to display the subtrees computed by UShER. The visualization opens in a new browser tab, using [localStorage]() to share data between tabs without transmitting any user data over the web.

## Installation (for developers)
