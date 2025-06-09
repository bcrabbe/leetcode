fn main() {
    let examples = vec![
        (
            2,
            vec![1, 3],
            1,
            vec![vec![0, 0], vec![0, 1]],
            vec![true, false],
            "Simple case: one self-path, one disconnected"
        ),
        (
            4,
            vec![2, 5, 6, 8],
            2,
            vec![vec![0, 1], vec![0, 2], vec![1, 3], vec![2, 3]],
            vec![false, false, true, true],
            "Path through intermediates"
        ),
        (
            0,
            vec![],
            0,
            vec![vec![0, 0], vec![0, 0]],
            vec![false, false],
            "Empty graph"
        ),
        (
            1,
            vec![0],
            2,
            vec![vec![0, 0], vec![0, 0]],
            vec![true, true],
            "Single node"
        ),
        (
            5,
            vec![1, 2, 3, 4, 5],
            1,
            vec![vec![0, 4], vec![1, 3], vec![2, 2]],
            vec![true, true, true],
            "Fully connected sequence"
        ),
        (
            4,
            vec![1, 10, 20, 30],
            5,
            vec![vec![0, 1], vec![2, 3]],
            vec![false, false],
            "Disconnected due to large gaps"
        ),
        (
            5,
            vec![3, 3, 3, 4, 5],
            0,
            vec![vec![0, 1], vec![1, 2], vec![0, 3]],
            vec![true, true, false],
            "Only identical numbers connect (max_diff = 0)"
        ),
        (
            3,
            vec![1, 2, 3],
            1,
            vec![vec![0, 3], vec![3, 3]],
            vec![false, false],
            "Out-of-range queries"
        ),
        (
            5,
            vec![1, 2, 3, 4, 5],
            1,
            vec![],
            vec![],
            "Empty queries"
        ),
    ];

    for (i, (n, nums, max_diff, queries, expected, comment)) in examples.into_iter().enumerate() {
        println!("Running Example {}: {}", i + 1, comment);
        let result = Solution::path_existence_queries(n, nums.clone(), max_diff, queries.clone());
        println!(
            "Example {}: {} \n  Output = {:?}, Expected = {:?}, Passed = {}\n",
            i + 1,
            comment,
            result,
            expected,
            if result == expected { "✅" } else { "❌" }
        );
    }
}

struct Solution;

impl Solution {
    pub fn path_existence_queries(n: i32, nums: Vec<i32>, max_diff: i32, queries: Vec<Vec<i32>>) -> Vec<bool> {
        if nums.len() == 0 || queries.len() == 0 {
            return vec![false; queries.len()];
        }
        let groups = Solution::group_nums(&nums, max_diff);
        queries.iter().map(|query| {
            if let [u, v] = query.as_slice() {
                if *u < 0 || *u >= n || *v < 0 || *v >= n {
                    println!("Invalid query");
                    false
                } else {
                    let connected = groups[*u as usize] == groups[*v as usize];
                    // println!("u = {}, v = {}, connected = {}", u, v, connected);
                    connected
                }
            } else {
                println!("Invalid query");
                false
            }
        }).collect()
    }

    fn group_nums(nums: &[i32], max_diff: i32) -> Vec<usize> {
        let mut groups = Vec::with_capacity(nums.len());
        groups.push(0);
        for i in 1..(nums.len()) {
            if (nums[i - 1] - nums[i]).abs() <= max_diff {
                groups.push(groups[i - 1]);
            } else {
                groups.push(groups[i - 1] + 1);
            }
        }
        // println!("nums {:#?}, groups {:#?}", nums, groups);
        groups
    }
}
