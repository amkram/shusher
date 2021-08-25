---
title: 'ShUShER: private browser-based placement of sensitive genome samples on phylogenetic trees'
tags:
  - phylogenetics
  - JavaScript
  - WebAssembly
  - React
  - SARS-CoV-2
authors:
  - name: Alexander Kramer
    orcid: 0000-0000-0000-0000
    affiliation: "1, 2"
  - name: Russell Corbett-Detig
    orcid: 0000-0000-0000-0000
    affiliation: "1, 2"
affiliations:
 - name: Department of Biomolecular Engineering, University of California Santa Cruz. Santa Cruz, CA 95064, USA
   index: 1
 - name: Genomics Institute, University of California Santa Cruz, Santa Cruz, CA 95064, USA
   index: 2
date: 19 August 2021
bibliography: paper.bib
---

# Summary

[ShUShER](https://github.com/amkram/shusher) (Shh: private Ultrafast Sample placement on Existing tRees) is a browser-based application for local analysis of sensitive biological sequence data. It uses UShER, a previously developed algorithm [@Turakhia:2021], to place user-provided genome samples on an existing phylogenetic tree and return subtrees surrounding those samples. It displays visualizations of the results using Auspice, part of the Nextstrain project [@Hadfield:2018]. UCSC hosts a [web tool](https://genome.ucsc.edu/cgi-bin/hgPhyloPlace) with similar functionality, but it performs server-side computation on user samples, making it unsuitable for samples containing Protected Health Information or other sensitive data. There are two main components of ShUShER: a port of the existing C++ UShER code to WebAssembly and a user interface built with React, which together perform computation on user-provided samples entirely client-side in a web browser.

# Statement of need

Phylogenetic trees are often used to help trace the origin, spread, and evolution of viruses. The continuously growing number of sequenced SARS-CoV-2 genomes has quickly overwhelmed the capabilities of many existing tree construction methods. UShER is a method that can efficiently place newly sequenced genomes on existing, large phylogenetic trees. Many researchers use the UShER web tool hosted at UCSC to place their samples on a global tree constructed from over one million SARS-CoV-2 genomes. Some viral genomes are considered Protected Health Information and cannot be transmitted over the Internet. Presently, researchers cannot use the UCSC web tool for such data and must instead install and run UShER locally with a command-line application. ShUShER is an alternative to this, providing a user-friendly platform for researchers to run UShER in their web browser while keeping their data private.

The current use case of ShUShER is the placement of SARS-CoV-2 genome samples on an existing global
tree of public sequences (maintained [here](https://hgdownload.soe.ucsc.edu/goldenPath/wuhCor1/UShER_SARS-CoV-2/)), though it
has future applications for any type of pathogen phylogenetic analysis.

# Acknowledgements

ShUShER uses or adapts code from several open source projects.
The authors thank the developers of [Nextclade](https://github.com/nextstrain/nextclade),
[Auspice](https://github.com/nextstrain/auspice),
[auspice.us](https://github.com/nextstrain/auspice.us), and [UShER](https://github.com/yatisht/usher).

# References
