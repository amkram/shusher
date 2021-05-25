import { alignPairwise } from '../../vendor/nextclade/alignPairwise'

function alignAndSave(names: string, sequences: string, reference: string, vcfFilename: string) {
    const numSamples = names.length;
    var headerString = '#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT';

     // pairwise align each sample to reference, collecting snps
    var alignments = [];
    for (var sampleNum=0; sampleNum < numSamples; sampleNum++) {
        alignments.push(alignPairwise(sequences[sampleNum], reference, 0));
    }

    for (var pos=0; pos < reference.length; pos++) {
        for (var sampleNum=0; sampleNum < numSamples; sampleNum++) {
            var alignment = alignments[sampleNum];
            /* The position we look at in the alignment is the reference
             * position + the number of dashes.
             * e.g. A-CCGTT [ref]
             *      ATCCGTT [sample]
             *        ^ This is reference index 1, but we look at index 2 in the alignment string.
             */
            var posInSample
        }
    }
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