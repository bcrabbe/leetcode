## Problem Description

Given an input list of strings, for each letter appearing anywhere in the list, find the other letter(s) that appear in the **most number of words** with that letter.

---

### Example:

**Input:**

```
['abc', 'bcd', 'cde']
```

**Output:**

```
{
  'a': ['b', 'c'],      # b appears in 1 word with a, c appears in 1 word with a
  'b': ['c'],           # c appears in 2 words with b, a and d each appear in only 1 word with b
  'c': ['b', 'd'],      # b appears in 2 words with c, d appears in 2 words with c. But a and e each appear in only 1 word with c.
  'd': ['c'],           # c appears in 2 words with d. But b and e each appear in only 1 word with d
  'e': ['c', 'd'],      # c appears in 1 word with e, d appears in 1 word with e
}
```

