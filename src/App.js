import './App.css';
import DataInput from './components/DataInput'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { useEffect } from 'react';
import { alignPairwise } from './tools/alignPairwise'


const useStyles = makeStyles((theme) => ({
  root: {
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
}));

function testAlignment() {
  const ref = 'ACGTACGTGG';

  var samples = [
  'ACGAACCGGG',
  'ACGAACGAGG',
  'ACGAACGTGG'];
  var numSamples = 3;
  var snps = {};
  var indels = {};
  var header_str = '';

  //pairwise align each sample to reference, collecting snps
  for (var sampleNum=0; sampleNum < numSamples; sampleNum++) {
    header_str += ' Sample' + sampleNum;

    var currAlignment = alignPairwise(samples[sampleNum], ref, 0);
    var alnRef = currAlignment.ref;
    var alnQuery = currAlignment.query;
    console.log(currAlignment);

    for (var i = 0; i < alnRef.length; i++) {
      var refPos = alnRef.join('').substring(0, i+1).replace('-','').length-1;
      if (alnRef[i] != alnQuery[i] && alnRef[i] != '-' && alnQuery[i] != '-') {
        if (!(i in snps)) {
          snps[refPos] = {};
          snps[refPos].genotypes = new Array(numSamples).fill(0);
          snps[refPos].altAlleles = [];
          snps[refPos].refAllele = alnRef[i];
        }
        if (! (snps[refPos].altAlleles.includes(alnQuery[i])) ) { // if the alternate allele hasn't been seen yet, add it to the list
          snps[refPos].altAlleles.push(alnQuery[i]);
        }
        snps[refPos].genotypes[sampleNum] = snps[refPos].altAlleles.indexOf(alnQuery[i]) + 1; // store the allele number per vcf specification
      }
    }  
  }

  // save VCF file
  console.log(snps)
  console.log('##fileformat=VCFv4.2');
  console.log(header_str);
  for (const pos in snps) {
    var idList = [];
    var refAllele = snps[pos].refAllele;
    var altAlleles = snps[pos].altAlleles;
    for (var i; i < altAlleles.length; i++) {
      idList.push(refAllele+pos+altAlleles[i])
    }
    var vcf_line = 'REFERENCE' + '\t' + (pos*1+1) + '\t' + idList.join(',') + '\t' + refAllele + '\t' + altAlleles.join(',') + '\t.\t.\t.\tGT\t' + snps[pos].genotypes.join(',');
    console.log(vcf_line);
  }

  //  NC_045512v2	1440	G1440A	G	A	.	.	AC=482,9;AN=39342	GT	1	1	1	1	1

  
//  alignPairwise()
}

function App() {
  const classes = useStyles();
  
  useEffect(() => {
//    window.saveFileFromURL('/latest_tree.pb', 'https://hgwdev.gi.ucsc.edu/~angie/UShER_SARS-CoV-2/public-latest.all.masked.pb'); 
    testAlignment();
})
  
  return (
    <div className={classes.root}>
      <div className="logo">
        <img className="logo-img" src="img/logo.png" alt="UShER logo"/>
      </div>
      <div className={classes.wrapper}>
        <Box className={classes.usherBox}>
          <DataInput/>
        </Box>
      </div>

    </div>
  );
}


export default App;