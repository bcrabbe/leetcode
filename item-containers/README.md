## 1. Items in Containers

Amazon would like to know how much inventory exists in their closed inventory compartments.
Given a string s consisting of items as "*" and closed compartments as an open and close "|" , an array of starting indices startIndices, and an array of ending indices endIndices, determine the number of items in closed compartments within the substring between the two indices, inclusive.

- An item is represented as an asterisk ("*" = ascii decimal 42)
- A compartment is represented as a pair of pipes that may or may not have items between them ('|' = ascii decimal 124).

### Example

s: '|**|*|'

startIndices: [1, 1]
endIndices: [5, 6]


The string has a total of 2 closed compartments, one with 2 items and one with 1 item. For the first pair of indices, (1, 5), the substring is '|**|*'. There are 2 items in a compartment.
For the second pair of indices, (1, 6), the substring is '|**|*|'. and there are 2 + 1 = 3 items in 2 compartments.
Both of the answers are returned in an array, [2, 3].

### Function Description

Complete the numberOfItems function in the editor below. The function must return an integer array that contains the results for each of the startIndices[] and endIndices[] pairs.

#### numberOfItems has three parameters:
- s: A string to evaluate
- startIndices: An integer array, the starting indices.
- endIndices: An integer array, the ending indices.

### Constraints

- 1 ≤ s, n ≤ 10^5
- 1 ≤ startIndices[i] ≤ endIndices[i] ≤ n
- Each character of s is either '*' or '|'
