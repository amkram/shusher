export const getFileType = (file) => {
  //TODO: Look at more than just extension?
  if (isFasta(file)) {
    return "fasta";
  } else if (isVcf(file)) {
    return "vcf";
  } else {
    return null;
  }
};

export const readFasta = (path) => {
  var data = {
    names: [],
    sequences: [],
  };
  const lines = FS.readFile(path, { encoding: "utf8" }).split("\n");
  var name = "";
  var sequence = "";
  var line = "";
  var first = true;
  for (var i = 0; i < lines.length; i++) {
    line = lines[i];
    if (line[0] === ">") {
      if (first) {
        // truncate everything after the first space in the fasta header
        name = line.substring(1).split(" ")[0];
        first = false;
        continue;
      }
      data.names.push(name);
      data.sequences.push(sequence);
      name = line.substring(1).split(" ")[0];
      sequence = "";
    } else {
      sequence += line.trim();
    }
  }
  data.names.push(name);
  data.sequences.push(sequence);
  return data;
};
const isFasta = (file) => {
  var extension = file.name.split(".").pop();
  if (extension === "fa" || extension === "fasta" || extension === "fna") {
    return true;
  }
  return false;
};

const isVcf = (file) => {
  var extension = file.name.split(".").pop();
  if (extension == "vcf") {
    return true;
  }
  return false;
};
