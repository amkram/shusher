import React from "react";

/* Contains details about the web app and usage. */

export default function ErrorSnackbar(props) {
  <div className={classes.alignedDiv}>
    <h3 className={classes.headingLeft}>What is this?</h3>
    <p>
      This is a web tool that uses{" "}
      <a
        target="_blank"
        href="https://www.nature.com/articles/s41588-021-00862-7"
      >
        UShER
      </a>{" "}
      to place user-provided SARS-CoV-2 sequences on a continuously growing
      global tree of samples. The{" "}
      <a
        target="_blank"
        href="https://hgdownload.soe.ucsc.edu/goldenPath/wuhCor1/UShER_SARS-CoV-2/"
      >
        global tree
      </a>{" "}
      is regularly updated and is comprised of publicly available sequences from{" "}
      <a target="_blank" href="https://www.ncbi.nlm.nih.gov/genbank/">
        GenBank
      </a>
      ,{" "}
      <a target="_blank" href="https://www.cogconsortium.uk/">
        COG-UK
      </a>
      , and{" "}
      <a target="_blank" href="https://bigd.big.ac.cn/ncov/">
        China National Center for Bioinformation
      </a>
      . Read more about the public tree on{" "}
      <a
        target="_blank"
        href="https://www.biorxiv.org/content/10.1101/2021.04.03.438321v1.full"
      >
        bioRxiv
      </a>
      .
    </p>
    <p>
      After placement, subtrees containing your samples can be visualized using{" "}
      <a
        target="_blank"
        href="https://docs.nextstrain.org/projects/auspice/en/stable/"
      >
        Auspice
      </a>
      .
    </p>
    <p>
      It is appropriate for use with samples containing Protected Health
      Information (PHI). Your uploaded sequences are not transmitted over the
      Internet and all computation and visualization is performed locally in
      your web browser.
    </p>
    <p>
      Please see the{" "}
      <a href="https://github.com/amkram/shusher">Github repository</a> for
      detailed instructions and information.
    </p>
    <h3 className={classes.headingLeft}>Should I use this?</h3>
    <p>
      Only if your samples contain sensitive data. We strongly encourage you to
      share your SARS-CoV-2 sequences with the public. Sharing sequence data
      enables rapid progress in SARS-CoV-2 research and genomic contact tracing.
    </p>
    <p>
      For most use cases, we recommend using the{" "}
      <a target="_blank" href="https://genome.ucsc.edu/cgi-bin/hgPhyloPlace">
        UShER online tool
      </a>{" "}
      that performs computation on UCSC servers. This web tool is intended to be
      used{" "}
      <strong className={classes.bold}>
        only for samples that contain PHI
      </strong>{" "}
      or other sensitive information.
    </p>
    <p>
      If you are interested in clade or mutation annotations, check out{" "}
      <a href="https://pangolin.cog-uk.io/">Pangolin</a>,{" "}
      <a target="_blank" href="https://clades.nextstrain.org/">
        Nextclade
      </a>
      , or the{" "}
      <a target="_blank" href="https://genome.ucsc.edu/cgi-bin/hgPhyloPlace">
        UShER online tool
      </a>
      .
    </p>
    <h3 className={classes.headingLeft}>How can I share my sequences?</h3>
    <p>
      Please submit your sequences to an{" "}
      <a
        target="_blank"
        href="https://ncbiinsights.ncbi.nlm.nih.gov/2020/08/17/insdc-covid-data-sharing/"
      >
        INSDC
      </a>{" "}
      member institution (
      <a target="_blank" href="https://submit.ncbi.nlm.nih.gov/sarscov2/">
        NCBI
      </a>
      ,{" "}
      <a target="_blank" href="https://www.covid19dataportal.org/submit-data">
        EMBL-EBI
      </a>
      , or{" "}
      <a
        target="_blank"
        href="https://www.ddbj.nig.ac.jp/ddbj/web-submission.html"
      >
        DDBJ
      </a>
      ) and{" "}
      <a target="_blank" href="https://www.gisaid.org/">
        GISAID
      </a>
      .
    </p>
    <p>
      You may find{" "}
      <a target="_blank" href="https://github.com/maximilianh/multiSub">
        multiSub
      </a>{" "}
      helpful in preparing submissions for multiple institutions at a time.
    </p>
    <h3 className={classes.headingLeft}>
      Why is it slower than command-line UShER?
    </h3>
    <p>
      This is a port of the UShER C++ code base to JavaScript / WebAssembly,
      leading to some performance decrease. This tool also does not parallelize
      computation while the original UShER does. If you have a large number of
      samples that contain sensitive information, we recommend using the UShER
      command-line tool. Instructions on how to install and use the tool are
      available{" "}
      <a
        target="_blank"
        href="https://usher-wiki.readthedocs.io/en/latest/UShER.html"
      >
        here
      </a>
      .
    </p>
    <h3 className={classes.headingLeft}>Acknowledgements</h3>
    <p>
      This app uses or adapts code from several open-source projects. We are
      grateful for their contributions.
    </p>
    <p>
      Pairwise sequence alignment uses the implementation from{" "}
      <a target="_blank" href="https://github.com/nextstrain/nextclade">
        Nextclade
      </a>
      .
      <br />
      <br />
      Visualization of subtrees is performed with{" "}
      <a
        target="_blank"
        href="https://github.com/nextstrain/auspice/blob/5132a1c1d063761eb02dc5434a8316c6d5be7085/docs/index.rst"
      >
        Auspice
      </a>
      .
      <br />
      <br />
      Scripts to modify the Auspice server are from{" "}
      <a target="_blank" href="https://github.com/nextstrain/auspice.us">
        auspice.us
      </a>
      .
      <br />
      <br />
      Nextclade, Auspice, and auspice.us are part of the{" "}
      <a target="_blank" href="https://github.com/nextstrain">
        Nextstrain
      </a>{" "}
      project.
      <br />
      <br />
      Sample placement is done using a ported version of{" "}
      <a target="_blank" href="https://github.com/yatisht/usher">
        UShER
      </a>
      .
    </p>
  </div>;
}
