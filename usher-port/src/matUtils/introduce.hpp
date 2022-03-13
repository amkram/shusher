#include "common.hpp"
#include <boost/date_time/gregorian/gregorian.hpp>
#include <math.h>

po::variables_map parse_introduce_command(po::parsed_options parsed);
std::unordered_map<std::string, std::vector<std::string>> read_two_column (std::string sample_filename);
void record_clade_regions(MAT::Tree* T, std::unordered_map<std::string, std::unordered_map<std::string, float>> region_assignments, std::string filename);
size_t get_monophyletic_cladesize(MAT::Tree* T, std::unordered_map<std::string, float> assignments, MAT::Node* subroot = NULL);
float get_association_index(MAT::Tree* T, std::unordered_map<std::string, float> assignments, bool permute = false, MAT::Node* subroot = NULL);
std::pair<boost::gregorian::date,boost::gregorian::date> get_nearest_date(MAT::Tree* T, MAT::Node* n, std::set<std::string>* in_samples, std::unordered_map<std::string, std::string> datemeta = {});
std::unordered_map<std::string, float> get_assignments(MAT::Tree* T, std::unordered_set<std::string> sample_set, bool eval_uncertainty = false);
void introduce_main(po::parsed_options parsed);