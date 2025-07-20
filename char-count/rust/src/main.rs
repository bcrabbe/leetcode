use std::collections::{HashMap, HashSet};

struct Solution;

impl Solution {
    pub fn most_common_co_letters(words: Vec<String>) -> HashMap<char, Vec<char>> {
        println!("words {:?}", words);
        let mut counts: HashMap<char, HashMap<char, u16>> = HashMap::new();
        for word in &words {
            Self::count_word(&mut counts, word)
        }
        println!("counts {:?}", counts);
        Self::find_most_common(&counts)
    }

    fn count_word(counts: &mut HashMap<char, HashMap<char, u16>>, word: &str) {
        // Repeated letters within the same word count only once per word,
        // because co-occurrence is about presence together in a word, not how many times.
        let chars: Vec<char> = word.chars().collect::<HashSet<_>>().into_iter().collect();
        for (i, current) in chars.iter().enumerate() {
            let char_counts = counts.entry(*current).or_default();
            for (j, other) in chars.iter().enumerate() {
                if i != j {
                    char_counts.entry(*other).and_modify(|counter| *counter += 1).or_insert(1);
                }
            }
        }
    }

    fn find_most_common(counts: &HashMap<char, HashMap<char, u16>>) -> HashMap<char, Vec<char>> {
        let mut result = HashMap::new();
        for (ch, co_counts) in counts.iter() {
            if let Some(&max_count) = co_counts.values().max() {
                let mut max_chars: Vec<char> = co_counts
                    .iter()
                    .filter_map(|(&other_ch, &count)| {
                        if count == max_count {
                            Some(other_ch)
                        } else {
                            None
                        }
                    })
                    .collect();
                max_chars.sort_unstable(); // ✅ sort for consistent order
                result.insert(*ch, max_chars);
            }
        }
        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    fn run_test_case(input: Vec<&str>, expected: HashMap<char, Vec<char>>) {
        let input_vec = input.into_iter().map(String::from).collect();
        let result = Solution::most_common_co_letters(input_vec);
        assert_eq!(result, expected);
    }

    #[test]
    fn test_examples() {
        let test_cases: Vec<(&str, Vec<&str>, HashMap<char, Vec<char>>)> = vec![
            (
                "Original example with overlapping triples",
                vec!["abc", "bcd", "cde"],
                HashMap::from([
                    ('a', vec!['b', 'c']),
                    ('b', vec!['c']),
                    ('c', vec!['b', 'd']),
                    ('d', vec!['c']),
                    ('e', vec!['c', 'd']),
                ]),
            ),
            (
                "Minimal input: one word, all letters co-occur",
                vec!["abc"],
                HashMap::from([
                    ('a', vec!['b', 'c']),
                    ('b', vec!['a', 'c']),
                    ('c', vec!['a', 'b']),
                ]),
            ),
            (
                "No words",
                vec![],
                HashMap::new(),
            ),
            (
                "No overlaps: disjoint sets of letters",
                vec!["abc", "def", "ghi"],
                HashMap::from([
                    ('a', vec!['b', 'c']),
                    ('b', vec!['a', 'c']),
                    ('c', vec!['a', 'b']),
                    ('d', vec!['e', 'f']),
                    ('e', vec!['d', 'f']),
                    ('f', vec!['d', 'e']),
                    ('g', vec!['h', 'i']),
                    ('h', vec!['g', 'i']),
                    ('i', vec!['g', 'h']),
                ]),
            ),
            (
                "All letters always appear together equally",
                vec!["abcd", "abcd", "abcd"],
                HashMap::from([
                    ('a', vec!['b', 'c', 'd']),
                    ('b', vec!['a', 'c', 'd']),
                    ('c', vec!['a', 'b', 'd']),
                    ('d', vec!['a', 'b', 'c']),
                ]),
            ),
            (
                "One letter dominates co-occurrences",
                vec!["ab", "ac", "ad", "ae"],
                HashMap::from([
                    ('a', vec!['b', 'c', 'd', 'e']),
                    ('b', vec!['a']),
                    ('c', vec!['a']),
                    ('d', vec!['a']),
                    ('e', vec!['a']),
                ]),
            ),
            (
                "Repeated letters in words shouldn’t inflate counts",
                vec!["aabb", "bccd", "deee"],
                HashMap::from([
                    ('a', vec!['b']),
                    ('b', vec!['a', 'c', 'd']),
                    ('c', vec!['b', 'd']),
                    ('d', vec!['b', 'c', 'e']),
                    ('e', vec!['d']),
                ]),
            ),
        ];

        for (desc, input, expected) in test_cases {
            println!("Running test case: {}", desc);
            run_test_case(input, expected);
        }
    }
}
