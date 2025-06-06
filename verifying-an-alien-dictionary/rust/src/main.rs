use std::collections::HashMap;

struct Solution;

impl Solution {
    pub fn is_alien_sorted(words: Vec<String>, order: String) -> bool {
        if words.len() < 2 {
            return true;
        }
        let order_map = Self::char_order_map(order);
        let mut word_index = 0;
        let sorted = loop {
            let word = words.get(word_index).expect("word undefined");
            let next_word = words.get(word_index + 1).expect("next_word undefined");
            println!("word {word}, next_word {next_word}");
            if !Self::are_words_sorted(&order_map, word, next_word) {
                break false;
            }
            word_index += 1;
            if (word_index + 1) >= words.len() {
                break true;
            }
        };
        sorted
    }

    fn char_order_map(order: String) -> HashMap<char, usize> {
        let mut order_map: HashMap<char, usize> = HashMap::new();
        for (i, c) in order.char_indices() {
            order_map.insert(c, i);
        }
        order_map
    }

    fn are_words_sorted(order_map: &HashMap<char, usize>, word: &String, next_word: &String) -> bool {
        // Compare up to shortest string
        if let Some((i, (word_char, next_word_char))) = word.chars()
            .zip(next_word.chars())
            .enumerate()
            .find(|&(_i, (c1, c2))| c1 != c2) {
                // if they differ
                println!("First difference at index {}: '{}' vs '{}'", i, word_char, next_word_char);
                let word_char_order = *order_map.get(&word_char).expect("Word character missing from order string.");
                let next_word_char_order = *order_map.get(&next_word_char).expect("Word character missing from order string.");
                println!("word_char {word_char} order {word_char_order}, next_word_char {next_word_char} order {next_word_char_order}");
                word_char_order < next_word_char_order
            } else {
                // if the prefix is the same the next word must be longer for them to be sorted
                word.len() <= next_word.len()
            }
    }
}

fn main() {
    let examples = vec![
        (
            vec!["hello", "leetcode"],
            "hlabcdefgijkmnopqrstuvwxyz",
            true,
        ),
        (
            vec!["word", "world", "row"],
            "worldabcefghijkmnpqstuvxyz",
            false,
        ),
        (
            vec!["apple", "app"],
            "abcdefghijklmnopqrstuvwxyz",
            false,
        ),
        (
            vec!["", "app"],
            "abcdefghijklmnopqrstuvwxyz",
            true,
        ),
        (
            vec!["app", ""],
            "abcdefghijklmnopqrstuvwxyz",
            false,
        ),
        (
            vec!["app"],
            "abcdefghijklmnopqrstuvwxyz",
            true,
        ),
        (
            vec![""],
            "abcdefghijklmnopqrstuvwxyz",
            true,
        ),
        (
            vec![],
            "abcdefghijklmnopqrstuvwxyz",
            true,
        ),
        (
            vec!["hello", "hello"],
            "abcdefghijklmnopqrstuvwxyz",
            true,
        )
    ];

    for (i, (words, order, expected)) in examples.into_iter().enumerate() {
        let words_vec = words.iter().map(|s| s.to_string()).collect();
        let result = Solution::is_alien_sorted(words_vec, order.to_string());
        println!(
            "Example {}: Output = {}, Expected = {}, Passed = {}",
            i + 1,
            result,
            expected,
            if result == expected { "✅" } else { "❌" }
        );
    }
}
