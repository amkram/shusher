// import { readFasta } from './readFasta'
// import { alignPairwise } from './alignPairwise'

// export function fastaToVcf(fastaFilename: string, vcfFilename: string) {
//     const ref = ''; // load ref
//     const fastaData = readFasta(fastaFilename);
//     const sampleNames = fastaData[0];
//     const sampleSequences = fastaData[1];    

//     // align samples and store a vcf file of SNPs
//     alignAndSave(sampleNames, sampleSequences, ref, vcfFilename ); 
// }

// function alignAndSave(names: string, sequences: string, reference: string, vcfFilename: string) {
//     const numSamples = names.length;
//     var headerString = '#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT';

//     // pairwise align each sample to reference, collecting snps
//     for (var sampleNum=0; sampleNum < numSamples; sampleNum++) {

//         var snps = [];
//         headerString += '\t' + names[sampleNum];

//         var currAlignment = alignPairwise(sequences[sampleNum], reference, 0);
//         var alnRef = currAlignment.ref;
//         var alnQuery = currAlignment.query;
//         console.log(currAlignment);

//         for (var i = 0; i < alnRef.length; i++) {
//             // find the real position in the reference in case of gaps. Vcf is 1-based
//             var refPos = alnRef.join('').substring(0, i+1).replace('-','').length; 
//             if (alnRef[i] != alnQuery[i] && alnRef[i] != '-' && alnQuery[i] != '-') {
//                 if (!(i in snps)) {
//                     snps[refPos] = {};
//                     snps[refPos].genotypes = new Array(numSamples).fill(0);
//                     snps[refPos].altAlleles = [];
//                     snps[refPos].refAllele = alnRef[i];
//                 }
//                 // if the alternate allele hasn't been seen yet, add it to the list
//                 if (! (snps[refPos].altAlleles.includes(alnQuery[i])) ) {
//                     snps[refPos].altAlleles.push(alnQuery[i]);
//                 }
//                 // store the allele number per vcf specification
//                 snps[refPos].genotypes[sampleNum] = snps[refPos].altAlleles.indexOf(alnQuery[i]) + 1;
//             }
//         } 
//     }   
        
//     // save VCF file
//     console.log(snps)
//     console.log('##fileformat=VCFv4.2');
//     console.log(headerString);
//     for (const pos in snps) {
//         var idList = [];
//         var refAllele = snps[pos].refAllele;
//         var altAlleles = snps[pos].altAlleles;
//         for (var i : number; i < altAlleles.length; i++) {
//             idList.push(refAllele+pos+altAlleles[i])
//         }
//         var vcf_line = 'REFERENCE' + '\t' + (pos*1+1) + '\t' + idList.join(',') + '\t' + refAllele + '\t' + altAlleles.join(',') + '\t.\t.\t.\tGT\t' + snps[pos].genotypes.join(',');
//         console.log(vcf_line);
//     }
// }

export {}