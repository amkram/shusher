#include "common.hpp"

std::vector<std::string> mutation_paths(const MAT::Tree& T, std::vector<std::string> samples);
std::vector<std::string> clade_paths(MAT::Tree T, std::vector<std::string> clades);
std::vector<std::string> all_nodes_paths(MAT::Tree T);