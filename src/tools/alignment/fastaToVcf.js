//import { readFasta } from './readFasta'
import { alignAndSave } from './alignAndSave'

export function fastaToVcf(fastaFilename, vcfFilename) {
//     const fastaData = readFasta(fastaFilename);
//     const sampleNames = fastaData[0];
//     const sampleSequences = fastaData[1];    

//     // align samples and store a vcf file of SNPs
    const sampleNames = ['sample1', 'sample2', 'sample3'];
    const ref = 'ACCGGGTTTTAAACT';
    const sampleSequences = ['CCGGGTTCAAACN', 'ATCCGGGTTCAATCN', 'CCGGGTTCAATCN'];
    alignAndSave(sampleNames, sampleSequences, ref, 'out.vcf'); 
 }


export {}