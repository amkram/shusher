import { alignPairwise } from '../../vendor/nextclade/alignPairwise'
import { referenceGenomeVersion } from '../../data/constants.js'

export function alignAndSave(names, sequences, reference, vcfFilename) {
    const numSamples = names.length;
    var headerString = '#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT';

    // align every sample to the reference
    var alignments = [];
    for (var sampleNum=0; sampleNum < numSamples; sampleNum++) {
        alignments.push(alignPairwise(sequences[sampleNum], reference, 0));
        console.log(alignments[sampleNum]);
        headerString += '\t' + names[sampleNum];
    }

    var snps = {};

    for (var refPos = 0; refPos < reference.length; refPos++) {
        /* The position we look at in the alignment is the reference
        * position + the number of dashes in the reference before that point.
        * e.g. A-CCGTT [ref]
        *      ATCCGTT [sample]
        *        ^ This is reference index 1, but we look at index 2 in the alignment string.
        */
        var alnPos = null;
        var alignment = null;
        var altAllele = null;

        var refAllele  = reference[refPos];
        //console.log('reference position ' + refPos + ': ' + refAllele );
        snps[refPos] = [null, null, null];

        for (var sampleNum=0; sampleNum < numSamples; sampleNum++) {
            alignment = alignments[sampleNum];
            alnPos = getAlignmentPos(alignment.ref, refPos);
          //  console.log('alnPos: ' + alnPos);
            altAllele = alignment.query[alnPos];
            //console.log(alignment);
            //console.log(sampleNum + ' - alt allele:' + altAllele);
            if (refAllele === altAllele) {
                snps[refPos][sampleNum] = '*';
            } else if (altAllele === '-' || altAllele === 'N' || altAllele === 'n') {
                snps[refPos][sampleNum] = '.';
            } else {
                snps[refPos][sampleNum] = altAllele;
            }
        }
        if (snps[refPos].every(x => x === '*')) {
            // no polymorphism
            delete snps[refPos];
        }

    }
    saveVcf(snps, reference, headerString, names);
}       

function getAlignmentPos(alignedReference, referencePos) {
    var counter = 0;
    for (var pos = 0; pos < alignedReference.length; pos++) {
        if (alignedReference[pos] !== '-') {
            counter++;
        }
        if (counter - 1 == referencePos) {
            break;
        }
    }
    return pos;
}

function saveVcf(snps, reference, headerString, sampleNames) {
    return new Promise((resolve, reject) => {
        const numSamples = sampleNames.length;
        var vcfString = '';
        vcfString += '##fileformat=VCFv4.2' + '\n';
        vcfString += headerString + '\n';
        for (const pos in snps) {
            var altListStr = '';
            var altList = [];
            for (var i = 0; i < snps[pos].length; i++) {
                var altAllele = snps[pos][i];
                if (altAllele != '.' && altAllele != '*' && !altList.includes(altAllele)) {
                    altListStr += ',' + altAllele;
                    altList.push(altAllele);
                }
            }
            altListStr = altListStr.substring(1);
            if (altList.length == 0) {
                altListStr = '.'; //missing data 
            } else if (altList.every( (x) => x == '.')) {
                altListStr = '.';
            }
            var genotypes = '';
            for (var i = 0; i < numSamples; i++) {
                var encoding = null;
                if (snps[pos][i] == '*') {
                    encoding = 0;
                } else if (snps[pos][i] == '.') {
                    encoding = '.';
                } else {
                    for (var j = 0; j < altList.length; j++) {
                        if (snps[pos][i] == altList[j]) {
                            encoding = j+1;
                        }
                    }
                }
                genotypes += '\t' + encoding;
            }
            var vcf_line = referenceGenomeVersion + '\t' + (pos*1+1) + '\t'
                + '.' + '\t' + reference[pos] + '\t' + altListStr + '\t' + '.'
                + '\t' + '.' + '\t' + '.' + '\t' + 'GT' + genotypes;
            vcfString += vcf_line + '\n';
        }
        window.FS.writeFile('/new_samples.vcf', vcfString);
        resolve();
        //TODO: reject promise if saving file failed
    });
}