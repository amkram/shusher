//import { readFasta } from './readFasta'
import { alignPairwise } from './alignPairwise'

export function fastaToVcf(fastaFilename: string, vcfFilename: string) {
     const ref = ''; // load ref
//     const fastaData = readFasta(fastaFilename);
//     const sampleNames = fastaData[0];
//     const sampleSequences = fastaData[1];    

//     // align samples and store a vcf file of SNPs
     alignAndSave(sampleNames, sampleSequences, ref, vcfFilename ); 
// }


export {}