#include <string>
#include <boost/iostreams/filtering_stream.hpp>
#include <boost/iostreams/filter/gzip.hpp>
#include <tbb/pipeline.h>
#include <vector>
#include "src/new_tree_rearrangements/mutation_annotated_tree.hpp"
#include "tree_rearrangement_internal.hpp"
#include <utility>
struct Parsed_VCF_Line{
    Mutation_Annotated_Tree::Mutation mutation;
    //std::unordered_map<std::string, nuc_one_hot> *mutated;
    std::unordered_map<std::string, nuc_one_hot> mutated;
};