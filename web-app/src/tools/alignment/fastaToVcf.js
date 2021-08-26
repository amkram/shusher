import { readFasta } from "../files/fileHandling";
import { alignAndSave } from "./alignAndSave";

export function fastaToVcf(fastaFilename, vcfFilename) {
  const fastaData = readFasta(fastaFilename);
  const reference = readFasta("/reference.fasta").sequences[0];
  return alignAndSave(
    fastaData.names,
    fastaData.sequences,
    reference,
    vcfFilename
  );
}
