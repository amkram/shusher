#include "process_each_node.hpp"
#include "src/matOptimize/Profitable_Moves_Enumerators/Profitable_Moves_Enumerators.hpp"

/**
 * @brief Calculate Parsimony score change contributed by inserting src between dst and parent of dst, along the path to LCA
 * @param LCA
 * @param mutations Assuming state of all nodes stay the same, the mutations on the edge from dst to src to perserve the state of moved src.
 * @param[inout] parsimony_score_change
 * @param this_node dst node
 * @param parent_added the change in major alleles of the immediate children of LCA on path from dst to LCA
 * @param debug_from_dst First element is the Fitch set change from the original dst to the intermediate node formed with children dst and src, and then its parent, until there is no change to fitch set.
 * @return Whether it is more profitable to insert on the edge between this_node->parent and this_node or this_node->parent->parent and this_node->parent
 */
bool dst_branch(const MAT::Node *LCA,
                const range<Mutation_Count_Change> &mutations,
                int &parsimony_score_change, MAT::Node *this_node,
                Mutation_Count_Change_Collection &parent_added,int src_side_max_improvement
#ifdef DEBUG_PARSIMONY_SCORE_CHANGE_CORRECT
                ,std::vector<Mutation_Count_Change_Collection> &debug_from_dst
#endif
               ) {
    parent_added.reserve(mutations.size());
    //Change in major alleles set of this_node, needed to update major alleles set of parent of this_node
    //Push dst to dst->LCA node stack
    //Check whether the dst have any mutation not shared by src, if not, stop here, as moving to a child of dst will be at least as profitable, if there is any.
    //Also register parsimony score contributed by dst->src edge, and major allele state change of dst.
    get_parsimony_score_change_from_add(this_node, mutations, parent_added,
                                        parsimony_score_change
                                       )&&(!this_node->is_leaf());
    this_node = this_node->parent;

#ifdef DEBUG_PARSIMONY_SCORE_CHANGE_CORRECT
    debug_from_dst.push_back(parent_added);
#endif
    //Going up until LCA to calculate change in major allele state of nodes from dst to LCA, and number of mutations on corresponding edges
    Mutation_Count_Change_Collection parent_of_parent_added;
    //Number of allele count change will only decrease as going up the tree (each change need a change in allele count change among children to be triggered)
    parent_of_parent_added.reserve(parent_added.size());
    while (this_node != LCA) {
        parent_of_parent_added.clear();
        //When altering the state of nodes on dst branch, only incrementing the number of
        //state a child can have will reduce parsimony score, so use the number of incrementing
        //mutation count change as a upper bound of improvement possible as going up dst nodes
        get_intermediate_nodes_mutations(
            this_node,  parent_added,
            parent_of_parent_added, parsimony_score_change
        );

        //add current node dst->LCA node stack
        //In next iteration, major allele set change of this_node become the change in count of major allele state among children of its parent
        parent_added.swap(parent_of_parent_added);
        //If the major allele state of this_node didn't change, nor should its ancestors, so no need to go up anymore, just complete the node stack
        if (parent_added.empty()) {
            break;
        }
#ifdef DEBUG_PARSIMONY_SCORE_CHANGE_CORRECT
        debug_from_dst.push_back(parent_added);
#endif
        this_node = this_node->parent;
    }
    return true;
}