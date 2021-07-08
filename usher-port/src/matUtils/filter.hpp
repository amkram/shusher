#include "common.hpp"

MAT::Tree filter_master(const MAT::Tree& T, std::vector<std::string> sample_names, bool prune);
MAT::Tree prune_leaves (const MAT::Tree& T, std::vector<std::string> sample_names);
MAT::Tree get_sample_subtree (const MAT::Tree& T, std::vector<std::string> sample_names);
MAT::Tree get_sample_prune (const MAT::Tree& T, std::vector<std::string> sample_names);
void resolve_polytomy(MAT::Tree &T, std::vector<MAT::Node*> polytomy_nodes);
MAT::Tree resolve_all_polytomies(MAT::Tree T);