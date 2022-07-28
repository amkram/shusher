#include "place_sample.hpp"
#include "src/matOptimize/mutation_annotated_tree.hpp"
#include <cassert>
#include <csignal>
#include <cstdio>
static void update_possible_descendant_alleles(
    const MAT::Mutations_Collection &mutations_to_set,
    MAT::Node *node) {
    std::unordered_map<int, uint8_t> alleles;
    alleles.reserve(mutations_to_set.size());
    for (auto &mut : mutations_to_set) {
        alleles.emplace(mut.get_position(), mut.get_mut_one_hot());
    }
    while (!alleles.empty() && node) {
        for (auto &mut : node->mutations) {
            auto iter = alleles.find(mut.get_position());
            if (iter != alleles.end()) {
                if ((mut.get_descendant_mut() & iter->second) ==
                        iter->second) {
                    alleles.erase(iter);
                } else {
                    mut.set_descendant_mut(mut.get_descendant_mut()|iter->second);
                }
            }
        }
        node->bfs_index++;
        node = node->parent;
    }
    while (node) {
        node->bfs_index++;
        node = node->parent;
    }
}
static MAT::Node* add_children(MAT::Node* target_node,MAT::Node* sample_node,MAT::Tree& tree,bool keep_old_node) {
    MAT::Node* deleted_node=nullptr;
    if (keep_old_node&&((target_node->children.size()+1)>=target_node->children.capacity())) {
        MAT::Node* new_target_node=new MAT::Node(*target_node);
        tree.register_node_serial(new_target_node);
        for(auto child:new_target_node->children) {
            child->parent=new_target_node;
        }
        new_target_node->children.reserve(SIZE_MULT*new_target_node->children.size());
        if (!new_target_node->parent) {
            fprintf(stderr, "replacing root\n");
            tree.root=new_target_node;
            tree.root_ident++;
        }else {
        auto& parent_children=target_node->parent->children;
        auto iter=std::find(parent_children.begin(),parent_children.end(),target_node);
        /*if (iter==parent_children.end()) {
            fprintf(stderr, "not found in children\n");
        }*/
        *iter=new_target_node;
        }
        deleted_node=target_node;
        deleted_node->parent=nullptr;
        target_node=new_target_node;
    }
    target_node->children.push_back(sample_node);
    sample_node->parent=target_node;
    return deleted_node;
}

update_main_tree_output update_main_tree(const MAT::Mutations_Collection& sample_mutations,
        const MAT::Mutations_Collection& splitted_mutations,
        const MAT::Mutations_Collection& shared_mutations,
        MAT::Node* target_node,
        size_t node_idx, MAT::Tree& tree,size_t split_node_idx,bool keep_old_node) {
    // Split branch?
    MAT::Node* deleted_node=nullptr;
    MAT::Node *split_node=nullptr;
    MAT::Node *sample_node = new MAT::Node(node_idx);
    sample_node->mutations=sample_mutations;
    tree.register_node_serial(sample_node);
    sample_node->level=target_node->level;
    int sample_node_mut_count = 0;
    auto parent_node=target_node->parent;
    for (const auto &mut : sample_node->mutations) {
        if (!(mut.get_par_one_hot() & mut.get_mut_one_hot())) {
            sample_node_mut_count++;
        }
        assert(mut.get_position());
    }
    sample_node->branch_length = sample_node_mut_count;
    if ((splitted_mutations.empty() && (!target_node->is_leaf()))||target_node->is_root()) {
        deleted_node=add_children(target_node, sample_node,tree,keep_old_node);
    } else if (shared_mutations.empty() &&
               (!target_node->is_leaf())) {
        deleted_node=add_children(parent_node, sample_node,tree,keep_old_node);
    } else {
        /*if(!target_node->parent){
            fprintf(stderr, "spliting root?");
            raise(SIGTRAP);
        }*/
        MAT::Node* new_target_node=new MAT::Node(target_node->node_id);
        tree.register_node_serial(new_target_node);
        new_target_node->level=target_node->level;
        new_target_node->children.reserve(4*target_node->children.size());
        new_target_node->children=target_node->children;
        new_target_node->mutations = std::move(splitted_mutations);
        for (auto child : new_target_node->children) {
            child->parent=new_target_node;
        }
        int target_node_mut_count = 0;
        for (const auto &mut : target_node->mutations) {
            if (!(mut.get_mut_one_hot() & mut.get_par_one_hot())) {
                target_node_mut_count++;
            }
        }
        new_target_node->branch_length = target_node_mut_count;
        if (split_node_idx==0) {
            split_node = tree.create_node();
        } else {
            split_node= new MAT::Node(split_node_idx);
            tree.register_node_serial(split_node);
        }
        new_target_node->parent = split_node;
        sample_node->parent = split_node;
        split_node->level=target_node->level;
        split_node->parent = parent_node;
        split_node->mutations = std::move(shared_mutations);
        split_node->children.reserve(2*SIZE_MULT);
        split_node->children.push_back(new_target_node);
        split_node->children.push_back(sample_node);
        split_node->branch_length = split_node->mutations.size();
        auto& parent_children_vect=parent_node->children;
        auto iter =
            std::find(parent_children_vect.begin(),
                      parent_children_vect.end(), target_node);
        if (iter==parent_children_vect.end()||*iter!=target_node) {
            std::raise(SIGTRAP);
        }
        *iter = split_node;
        deleted_node=target_node;
        deleted_node->parent=nullptr;
        target_node=new_target_node;
    }
    update_possible_descendant_alleles(sample_node->mutations, sample_node->parent);
    /*#ifndef NDEBUG
    check_descendant_nuc(sample_node);
    check_descendant_nuc(target.target_node);
    check_descendant_nuc(sample_node->parent);
    #endif*/
    return update_main_tree_output{split_node, deleted_node};
}
bool check_overriden(MAT::Tree& tree,move_type* in) {
    for (const auto& place_target : std::get<0>(*in)) {
        if (place_target.target_node==tree.root) {
            if (place_target.parent_node!=(MAT::Node*)tree.root_ident) {
                fprintf(stderr, "root Mismatch  ; from placement: %zu ; actual %zu \n", (size_t)place_target.parent_node,tree.root_ident);
                return true;
            }
        }
        else{
            if (place_target.target_node->parent!=place_target.parent_node) {
                if(place_target.target_node->parent){
                auto par_id= place_target.target_node->parent?  place_target.target_node->parent->node_id:0;
                fprintf(stderr, "parent Mismatch  ; from placement: %zu ; actual %zu \n", place_target.parent_node->node_id,par_id);
                }else {
                fprintf(stderr,"old root");
                }
                return true;

            }
        }
        if (tree.get_node(place_target.target_node->node_id)!=place_target.target_node) {
            fprintf(stderr, "node id Mismatch: %zu \n", place_target.target_node->node_id);
            return true;
        }
    }
    return false;
}
move_type* find_place(MAT::Tree& tree,Sample_Muts* in) {
    auto output=new move_type;
    std::get<1>(*output)= in;
    const auto& condensed_muts =in->muts;
    do {
        auto main_tree_out=place_main_tree(condensed_muts, tree);
        std::get<0>(*output)=std::move(std::get<0>(main_tree_out));
    } while(check_overriden(tree, output));
    return output;
}