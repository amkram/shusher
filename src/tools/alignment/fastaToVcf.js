import { readFasta } from '../files/fileHandling'
import { alignAndSave } from './alignAndSave'

export function fastaToVcf(fastaFilename, vcfFilename) {
    const fastaData = readFasta(fastaFilename);
    const reference = readFasta('/reference.fasta').sequences[0];
    alignAndSave(fastaData.names, fastaData.sequences, reference, vcfFilename); 
 }