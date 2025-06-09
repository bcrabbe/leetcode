# 3532. Path Existence Queries in a Graph I
http://leetcode.com/problems/path-existence-queries-in-a-graph-i/description/
**Medium**

You are given an integer `n` representing the number of nodes in a graph, labeled from `0` to `n - 1`.

You are also given an integer array `nums` of length `n` sorted in non-decreasing order, and an integer `maxDiff`.

An undirected edge exists between nodes `i` and `j` if the absolute difference between `nums[i]` and `nums[j]` is at most `maxDiff` (i.e., `|nums[i] - nums[j]| <= maxDiff`).

You are also given a 2D integer array `queries`. For each `queries[i] = [ui, vi]`, determine whether there exists a path between nodes `ui` and `vi`.

Return a boolean array `answer`, where `answer[i]` is `true` if there exists a path between `ui` and `vi` in the `i`th query and `false` otherwise.

---

## Example 1

**Input:**
```

n = 2
nums = [1,3]
maxDiff = 1
queries = [[0,0],[0,1]]

```

**Output:**
```

[true,false]

```

**Explanation:**

- Query `[0,0]`: Node 0 has a trivial path to itself.
- Query `[0,1]`: There is no edge between Node 0 and Node 1 because `|1 - 3| = 2`, which is greater than `maxDiff`.

Final answer: `[true, false]`.

---

## Example 2

**Input:**
```

n = 4
nums = [2,5,6,8]
maxDiff = 2
queries = [[0,1],[0,2],[1,3],[2,3]]

```

**Output:**
```

[false,false,true,true]

```

**Explanation:**

- Query `[0,1]`: `|2 - 5| = 3` → No edge
- Query `[0,2]`: `|2 - 6| = 4` → No edge
- Query `[1,3]`: Path exists through Node 2:
  `|5 - 6| = 1` and `|6 - 8| = 2` → Valid edges
- Query `[2,3]`: `|6 - 8| = 2` → Edge exists

Final answer: `[false, false, true, true]`.

---

## Constraints

- `1 <= n == nums.length <= 10⁵`
- `0 <= nums[i] <= 10⁵`
- `nums` is sorted in non-decreasing order.
- `0 <= maxDiff <= 10⁵`
- `1 <= queries.length <= 10⁵`
- `queries[i] == [ui, vi]`
- `0 <= ui, vi < n`
