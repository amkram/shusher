
/**
 * Newick format parser in JavaScript.
 *
 * Copyright (c) Jason Davies 2010.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 */

/* NOTE: parseNewick function slightly modified to produce an object better suited for Nextstrain. */
/* further modified for use with UShER (add color metadata) */

const parseNewick = (nwk, userSamples) => {
    const ancestors = [];
    let tree = {};
    const tokens = nwk.split(/\s*(;|\(|\)|,|:)\s*/);
    for (let i=0; i<tokens.length; i++) {
      const token = tokens[i];
      const subtree = {};
      switch (token) {
        case '(': // new child nodes up next
          tree.children = [subtree];
          ancestors.push(tree);
          tree = subtree;
          break;
        case ',': // next node: another child of the last ancestor
          ancestors[ancestors.length-1].children.push(subtree);
          tree = subtree;
          break;
        case ')': // optional name next
          tree = ancestors.pop();
          break;
        case ':': // optional length next
          break;
        default:
          const x = tokens[i-1];
          if (x === ')' || x === '(' || x === ',') {
            tree.name = token;
          } else if (x === ':') {
            tree.node_attrs = {div: parseFloat(token)};
            if (userSamples.includes(tree.name)) {
              tree.node_attrs.type = {value: "Your samples"};
            } else {
              tree.node_attrs.type = {value: "Existing samples"};
            }
          }
      }
    }
    return tree;
  };
  
  
  const getTreeStruct = (nwk, userSamples) => {
    const tree = parseNewick(nwk, userSamples);
  
    /* recursively create missing node names */
    let count = 10000;
    const addNodeName = (node) => {
      if (!node.name) {
        node.name=`NODE${count}`;
        count++;
      }
      if (node.children) {
        node.children.forEach((child) => addNodeName(child));
      }
    };
    addNodeName(tree);
  
    /* divergence should be cumulative for Auspice! */
    const cumulativeDivs = (node, soFar=0) => {
      node.node_attrs.div += soFar;
      if (node.children) {
        node.children.forEach((child) => cumulativeDivs(child, node.node_attrs.div));
      }
    };
    cumulativeDivs(tree);
  
    return tree;
  };
  
  /**
   * Convert a newick string to an auspice (v2) JSON
   * @param {string} nwk newick string
   * @returns {object} auspice JSON
   */
  export const newickToAuspiceJson = (name, nwk, userSamples) => {
    const json = {
      version: "2.0",
      meta: {
        title: name,
        panels: ["tree"],
        description: makeDescription(name),
        colorings: [
          {
              "key": "type",
              "title": "Sample category",
              "type": "categorical",
              "scale": [
                  [
                    "Your samples",
                    "#3d74ff"
                  ],
                  [
                      "Existing samples",
                      "#e3e3e3"
                  ]
              ]
                
          }
      ],
      filters: [
          "type"
      ]
      },
      
      tree: getTreeStruct(nwk, userSamples)
    };
    return json;
  };
  
  function makeDescription(name) {
    return `
  Dataset generated on
  ${(new Date()).toLocaleDateString('en-EN', {month: "short", weekday: "short", day: "2-digit", year: "numeric"})}.
  If you have metadata you wish to display, you can now drag on a CSV file and it will be added into this view,
  [see here](https://nextstrain.github.io/auspice/advanced-functionality/drag-drop-csv-tsv) for more info.
  `
  }