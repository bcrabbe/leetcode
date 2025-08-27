# Swap Nodes [Algo] – [HackerRank](https://www.hackerrank.com/challenges/swap-nodes-algo/problem)

A binary tree is a tree which is characterized by one of the following properties:
- It can be *empty* (null).
- It contains a *root node* only.
- It contains a root node with a left subtree, a right subtree, or both. These subtrees are also binary trees.

## In-order Traversal
In-order traversal is:
1. **Traverse the left subtree.**
2. **Visit root.**
3. **Traverse the right subtree.**

 For in-order traversal, start from the left child of the root node and keep exploring the left subtree until you reach a leaf. When you reach a leaf, back up to its parent, check for a right child and visit it if there is one. If there is not a child, you've explored its left and right subtrees fully. If there is a right child, traverse its left subtree then its right in the same manner. Continue until you have traversed the entire tree.

You store the value of a node when:
- It is the first node visited.
- It is a leaf, so visited only once.
- All of its subtrees have been explored; at this point, it is visited only once.
- It is the root, and this is the first time it is visited.

## Swapping

**Swapping subtrees** means: if a node has a left subtree \( L \) and a right subtree \( R \), after swap its left subtree becomes \( R \) and right subtree becomes \( L \).

### Example:
**Before swap (at node 1):**

```
Depth:    1
[1]
        /   \
Depth: 2   2
      2     3
        \     \
Depth: 3     3
      4       5
```

**After swap at depth 2:**

```
Depth:   1
[1]
       /   \
Depth:2   2
      3    2
       \     \
Depth:3     3
      5     4
```

- In-order traversal of the original tree: **2 4 1 3 5**
- In-order traversal of the swapped tree: **3 5 1 2 4**

## Swap Operation

### Node Depth
- The root node is at **depth 1**.
- If the depth of the parent node is \( d \), the child's depth is \( d+1 \).

### Swap Procedure
Given a tree and integer \( k \), swap the subtrees of all nodes at every depth \( h \), where \( h \in [k, 2k, 3k, ...] \) (i.e., every multiple of \( k \)). If \( h \) is a multiple of \( k \), swap the left and right subtrees at level \( h \).

You are given a tree of \( n \) nodes (indexed from 1 to \( n \)), rooted at 1. You must perform \( t \) swap operations as specified by the queries, and return the in-order traversal after each swap.

---

## Function Description

Complete the function **swapNodes** with the signature:

```
def swapNodes(indexes, queries):
```

- `indexes`: a 2D array representing the tree. Each index corresponds to a node, and the cell contains `[left, right]` (children indices). If there is no child, use -1.
- `queries`: an array of integers for each \( k \) value for the swap operation.

### Output
Return a 2D array where each row is the in-order traversal of the tree after each swap operation.

---

## Input Format

- The first line: integer \( n \), number of nodes.
- Next \( n \) lines: each line contains two integers \( a, b \), the indices of the left and right children of the \( i \)th node. Use -1 for null nodes.
- The next line: integer \( t \) (number of queries).
- Next \( t \) lines: integer \( k \) for each query.

---

## Output Format

For each \( k \), perform the swap operation and output the in-order traversal, each traversal on its own line.

---

## Constraints

- Either \( a = -1 \) or \( 1 \le a \le n \).
- Either \( b = -1 \) or \( 1 \le b \le n \).
- The index of a non-null child is always greater than that of its parent.

---

## Sample Input 0

```
3
2 3
-1 -1
-1 -1
2
1
1
```

## Sample Output 0

```
3 1 2
2 1 3
```

### Explanation 0

- Nodes 2 and 3 have no children, so swaps have no effect on them.
- Only the root's children are swapped.

```
    1   [s]       1    [s]       1   
   / \      ->   / \        ->  / \  
  2   3 [s]     3   2  [s]     2   3
```

(\[s\] indicates a swap is made at this depth.)

---

## Sample Input 1

```
5
2 3
-1 4
-1 5
-1 -1
-1 -1
1
2
```

## Sample Output 1

```
4 2 1 5 3
```

### Explanation 1

Swapping children of nodes 2 and 3:

```
    1                  1  
   / \                / \ 
  2   3   [s]  ->    2   3
   \   \            /   / 
    4   5          4   5  
```

---

## Sample Input 2

```
11
2 3
4 -1
5 -1
6 -1
7 8
-1 9
-1 -1
10 11
-1 -1
-1 -1
-1 -1
2
2
4
```

## Sample Output 2

```
2 9 6 4 1 3 7 5 11 8 10
2 6 9 4 1 3 7 5 10 8 11
```

### Explanation 2

First swap operation at nodes with depth 2 and 4, second at depth 4:

```
         1                     1                          1             
        / \                   / \                        / \            
       /   \                 /   \                      /   \           
      2     3    [s]        2     3                    2     3          
     /      /                \     \                    \     \         
    /      /                  \     \                    \     \        
   4      5          ->        4     5          ->        4     5       
  /      / \                  /     / \                  /     / \      
 /      /   \                /     /   \                /     /   \     
6      7     8   [s]        6     7     8   [s]        6     7     8
 \          / \            /           / \              \         / \   
  \        /   \          /           /   \              \       /   \  
   9      10   11        9           11   10              9     10   11
```

---

 **Math Note:** The swap happens at all depths that are multiples of \( k \): i.e., \( h \in \{k, 2k, 3k, ...\} \).

 - If the depth of a node is *exactly* \( k \), \( 2k \), \( 3k \), etc. (i.e. divisible by \( k \)), a swap is performed at that node during the swap operation.
 - Otherwise, the tree remains unchanged at that node.

 There were some math symbols not copied directly (like \( h \in [k, 2k, 3k, ...] \)) — this is as described above, and matches the original problem statement[1].



