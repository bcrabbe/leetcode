### shortest-unique-substring

Given an input list of names, for each name, find the shortest substring that only appears in that name.

**Example:**

Input: `["cheapair", "cheapoair", "peloton", "pelican"]`

Output:
- `"cheapair": "pa"`
every other 1-2 length substring overlaps with cheapoair
- `"cheapoair": "po"`
"oa" would also be acceptable
- `"pelican": "ca"`
"li", "ic", or "an" would also be acceptable
- `"peloton": "t"`
this single letter doesn't occur in any other string
