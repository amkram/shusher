#include "Fitch_Sankoff.hpp"
#include "check_samples.hpp"
#include "src/new_tree_rearrangements/mutation_annotated_tree.hpp"
#include "tree_rearrangement_internal.hpp"
#include <boost/filesystem/operations.hpp>
#include <boost/filesystem/path.hpp>
#include <boost/program_options/value_semantic.hpp>
#include <csignal>
#include <cstddef>
#include <cstdlib>
#include <ctime>
#include <tbb/concurrent_vector.h>
#include <tbb/task.h>
#include <cstdio>
#include <fcntl.h>
#include <string>

#include <tbb/task_scheduler_init.h>
#include <unistd.h>
#include <sys/stat.h>
#include <unordered_set>
#include <boost/program_options.hpp> 
#include <vector>
#include <iostream>
MAT::Node* get_LCA(MAT::Node* src,MAT::Node* dst);
FILE* movalbe_src_log;
bool interrupted;
std::condition_variable progress_bar_cv;
bool timed_print_progress;
tbb::task_group_context search_context;
void interrupt_handler(int){
    fputs("interrupted\n", stderr);
    search_context.cancel_group_execution();
    interrupted=true;
    fflush(movalbe_src_log);
}

void log_flush_handle(int){
    fflush(movalbe_src_log);
    progress_bar_cv.notify_all();
}

namespace po = boost::program_options;
namespace MAT = Mutation_Annotated_Tree;
MAT::Node* get_LCA(MAT::Node* src,MAT::Node* dst);
static void make_output_path(std::string& path_template){
    auto fd=mkstemps(const_cast<char*>(path_template.c_str()),3);
    close(fd);
}

void print_file_info(std::string info_msg,std::string error_msg,const std::string& filename){
    struct stat stat_buf;
    errno=0;
    if(stat(filename.c_str(), &stat_buf)==0){
        fprintf(stderr,"%s %s last modified: %s",info_msg.c_str(),filename.c_str(),ctime(&stat_buf.st_mtime));
    }else {
        perror(("Error accessing "+error_msg+" "+filename+" :").c_str());
        exit(EXIT_FAILURE);
    }
}
int main(int argc, char **argv) {
    std::string output_path;
    std::string input_pb_path;
    std::string input_complete_pb_path;
    std::string input_nh_path;
    std::string input_vcf_path;
    std::string intermediate_pb_base_name;
    std::string profitable_src_log;
    int radius;
    size_t max_queued_moves;
    po::options_description desc{"Options"};
    uint32_t num_cores = tbb::task_scheduler_init::default_num_threads();
    uint32_t num_threads;
    std::string num_threads_message = "Number of threads to use when possible [DEFAULT uses all available cores, " + std::to_string(num_cores) + " detected on this machine]";
    bool no_write_intermediate;
    desc.add_options()
        ("vcf,v", po::value<std::string>(&input_vcf_path)->default_value(""), "Input VCF file (in uncompressed or gzip-compressed .gz format) ")
        ("tree,t", po::value<std::string>(&input_nh_path)->default_value(""), "Input tree file")
        ("threads,T", po::value<uint32_t>(&num_threads)->default_value(num_cores), num_threads_message.c_str())
        ("load-mutation-annotated-tree,i", po::value<std::string>(&input_pb_path)->default_value(""), "Load mutation-annotated tree object")
        ("save-mutation-annotated-tree,o", po::value<std::string>(&output_path)->required(), "Save output mutation-annotated tree object to the specified filename [REQUIRED]")
        ("save-intermediate-mutation-annotated-tree,m", po::value<std::string>(&intermediate_pb_base_name)->default_value(""), "Save intermediate mutation-annotated tree object to the specified filename")
        ("radius,r", po::value<int32_t>(&radius)->default_value(10),
         "Radius in which to restrict the SPR moves.")
        ("profitable_src_log,s", po::value<std::string>(&profitable_src_log)->default_value("/dev/null"),
         "The file to log from which node a profitable move can be found.")
        ("ambi_protobuf,a", po::value<std::string>(&input_complete_pb_path)->default_value(""),
         "Continue from intermediate protobuf")
        ("max_queued_moves,q",po::value<size_t>(&max_queued_moves)->default_value(1000),"Maximium number of profitable moves found before applying these moves")
        ("do-not-write-intermediate-files,n","Do not write intermediate files.")
        ("exhaustive_mode,e","Search every non-root node as source node.");
        
    po::options_description all_options;
    all_options.add(desc);
    interrupted=false;
    signal(SIGUSR2,interrupt_handler);
    signal(SIGUSR1, log_flush_handle);
    po::variables_map vm;
    if (argc==1) {
        std::cerr << desc << std::endl;
        return EXIT_FAILURE;
    }
    try{
        po::store(po::command_line_parser(argc, argv).options(all_options).run(), vm);
        po::notify(vm);
    }
    catch(std::exception &e){
        std::cerr << desc << std::endl;
        // Return with error code 1 unless the user specifies help
        if(vm.count("help"))
            return 0;
        else
            return 1;
    }
    //std::string cwd=get_current_dir_name();
    no_write_intermediate=vm.count("do-not-write-intermediate-files");
    bool search_all_nodes=vm.count("exhaustive_mode");
        try{
        auto output_path_dir_name=boost::filesystem::system_complete(output_path).parent_path();
        if(!boost::filesystem::exists(output_path_dir_name)){
            boost::filesystem::create_directories(output_path_dir_name);
        }
        errno=0;
    } catch(const boost::filesystem::filesystem_error& ex){
        std::cerr<<"Cannot create parent directory of output path\n";
        std::cerr<<ex.what()<<std::endl;
        exit(EXIT_FAILURE);
    }
    auto fd=open(output_path.c_str(),O_WRONLY|O_CREAT|O_TRUNC,S_IRUSR|S_IWUSR);
    if (fd==-1) {
        perror(("Cannot create output file"+output_path).c_str());
        exit(EXIT_FAILURE);
    }else {
        close(fd);
    }

    if (intermediate_pb_base_name==""&&(!no_write_intermediate)) {
        intermediate_pb_base_name=output_path+"intermediateXXXXXX.pb";
        auto fd=mkstemps(const_cast<char*>(intermediate_pb_base_name.c_str()), 3);
        close(fd);
    }
    std::string intermediate_writing;
    std::string intermediate_template;
    intermediate_template=intermediate_pb_base_name+"temp_eriting_XXXXXX.pb";
    fputs("Summary:\n",stderr);
    if (input_complete_pb_path!="") {
        print_file_info("Continue from", "continuation protobut,-a", input_complete_pb_path);
    }else if (input_pb_path!="") {
        if (input_vcf_path=="") {
            print_file_info("Load both starting tree and sample variant from", "input protobut,-i", input_pb_path);
        }else {
            print_file_info("Extract starting tree from", "input protobut,-i", input_pb_path);
            print_file_info("Load sample variant from", "sample vcf,-v", input_vcf_path);
        }
    }else if (input_nh_path!=""&&input_vcf_path!=""){
        print_file_info("Load starting tree from", "starting tree file,-t", input_nh_path);
        print_file_info("Load sample variant from", "sample vcf,-v", input_vcf_path);
    }else {
        fputs("Input file not completely specified. Please either \n"
            "1. Specify an intermediate protobuf from last run with -a to continue optimization, or\n"
            "2. Specify a usher-compatible protobuf with -i, and both starting tree and sample variants will be extracted from it, or\n"
            "3. Specify a usher-compatible protobuf with -i for starting tree, and a VCF with -v for sample variants, or\n"
            "4. Specify the starting tree in newick format with -t, and a VCF with -v for sample variants.\n",stderr);
        std::cerr << desc << std::endl;
        exit(EXIT_FAILURE);
    }
    fprintf(stderr,"Will output final protobuf to %s .\n",output_path.c_str());
    if (no_write_intermediate) {
        fprintf(stderr,"Will not write intermediate file. WARNNING: It will not be possible to continue optimization if this program is killed in the middle.\n");
    }else{
        fprintf(stderr,"Will output intermediate protobuf to %s. \n",intermediate_pb_base_name.c_str());
    }
    auto pid=getpid();
    if (profitable_src_log!="/dev/null") {
        fprintf(stderr,"Will write list of source nodes where a profitable move can be found to %s. \n",profitable_src_log.c_str());
        fprintf(stderr,"Run kill -s SIGUSR1 %d to flush the source node log\n",pid);
    }
    timed_print_progress=isatty(fileno(stderr));
    if (!timed_print_progress) {
        fprintf(stderr,"stderr is not a terminal, will not print progress\n");
        fprintf(stderr,"Run kill -s SIGUSR1 %d to print progress\n",pid);
    }
    fprintf(stderr,"Will consider SPR moves within a radius of %d. \n",radius);
    fprintf(stderr, "Will stop search and apply all moves found when %zu moves are found\n",max_queued_moves);
    fprintf(stderr,"Run kill -s SIGUSR2 %d to apply all the move found immediately, then output and exit.\n",pid);
    fprintf(stderr,"Using %d threads. \n",num_threads);
    if (search_all_nodes) {
        fprintf(stderr, "Exhaustive mode: Consider move all nodes.\n");
    }else {
        fprintf(stderr, "Will only consider nodes carrying mutations that occured more than twice anywhere in the tree.\n");
    }
    tbb::task_scheduler_init init(num_threads);

    //Loading tree
    Original_State_t origin_states;
    Mutation_Annotated_Tree::Tree t;
    
    if (input_complete_pb_path!="") {
        t.load_detatiled_mutations(input_complete_pb_path);
    }else{
        if (input_vcf_path != "") {
            fputs("Loading input tree\n",stderr);
            if (input_nh_path != "") {
                t = Mutation_Annotated_Tree::create_tree_from_newick(
                    input_nh_path);
                fprintf(stderr, "Input tree have %zu nodes\n",t.all_nodes.size());
            } else {
                t = MAT::load_mutation_annotated_tree(input_pb_path);
                t.uncondense_leaves();
            }
            fputs("Finished loading input tree, start reading VCF and assigning states \n",stderr);
            load_vcf_nh_directly(t, input_vcf_path, origin_states);
        } else {
            t = load_tree(input_pb_path, origin_states);
        }
        if(!no_write_intermediate){
            fputs("Checkpoint initial tree.\n",stderr);
            intermediate_writing=intermediate_template;
            make_output_path(intermediate_writing);
            t.save_detailed_mutations(intermediate_writing);
            rename(intermediate_writing.c_str(), intermediate_pb_base_name.c_str());
            fputs("Finished checkpointing initial tree.\n",stderr);
        }
    }
    size_t new_score;
    size_t score_before;
    int stalled = 0;

    #ifndef NDEBUG
    Original_State_t origin_state_to_check(origin_states);
    check_samples(t.root, origin_state_to_check, &t);
    #endif

    score_before = t.get_parsimony_score();
    new_score = score_before;
    fprintf(stderr, "after state reassignment:%zu\n", score_before);

    tbb::concurrent_vector<MAT::Node *> nodes_to_search;
    std::vector<MAT::Node *> bfs_ordered_nodes;
    bfs_ordered_nodes = t.breadth_first_expansion();
    movalbe_src_log=fopen(profitable_src_log.c_str(),"w");
    if (!movalbe_src_log) {
        perror(("Error writing to log file "+profitable_src_log).c_str());
        movalbe_src_log=fopen("/dev/null", "w");
    }
    bool isfirst=true;
    while(stalled<1){
    if (interrupted) {
        break;
    }
    bfs_ordered_nodes = t.breadth_first_expansion();
    if (search_all_nodes) {
        nodes_to_search=tbb::concurrent_vector<MAT::Node*>(bfs_ordered_nodes.begin(),bfs_ordered_nodes.end());
    }else{
        fputs("Start Finding nodes to move \n",stderr);
        find_nodes_to_move(bfs_ordered_nodes, nodes_to_search,isfirst,radius);
    }
    isfirst=false;
    fprintf(stderr,"%zu nodes to search\n",nodes_to_search.size());
    if (nodes_to_search.empty()) {
        break;
    }
    //Actual optimization loop
    while (!nodes_to_search.empty()) {
        if (interrupted) {
            break;
        }
        bfs_ordered_nodes = t.breadth_first_expansion();
        new_score =
            optimize_tree(bfs_ordered_nodes, nodes_to_search, t,radius,movalbe_src_log,max_queued_moves
            #ifndef NDEBUG
            , origin_states
            #endif
            );
        fprintf(stderr, "after optimizing:%zu\n\n", new_score);
        if(!no_write_intermediate){
            intermediate_writing=intermediate_template;
            make_output_path(intermediate_writing);
            t.save_detailed_mutations(intermediate_writing);
            rename(intermediate_writing.c_str(), intermediate_pb_base_name.c_str());
        }
    }
        if (new_score >= score_before) {
            stalled++;
        } else {
            score_before = new_score;
            stalled = 0;
        }
        clean_tree(t);
    }
    fprintf(stderr, "Final Parsimony score %zu\n",t.get_parsimony_score());
    fclose(movalbe_src_log);
    save_final_tree(t, origin_states, output_path);
    for(auto& pos:mutated_positions){
        delete pos.second;
    }
    t.delete_nodes();
}
