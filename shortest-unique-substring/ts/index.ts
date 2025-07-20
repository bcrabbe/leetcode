// import _ from 'lodash';
// import R from 'ramda';
import Mocha from 'mocha';
import assert from 'assert';

const mocha = new Mocha();
// Required to ensure `describe` and `it` are available in this context
mocha.suite.emit('pre-require', globalThis, 'solution', mocha);

type Word = string;
type UniqueSubstrings = Record<Word, string>;

const getShortestUniqueSubstrings = (words: Word[]): UniqueSubstrings => {
  // console.log(words);
  const substringsPerWord = words.reduce<Set<string>[]>(
    (acc, word) => {
      // substrings added to the set in increasing size
      const wordSubstrings = new Set<string>();
      for (let window = 1; window <= word.length; window++) {
        for (let i = 0; i + window <= word.length; i++) {
          const substring = word.slice(i, i + window);
          wordSubstrings.add(substring);
        }
      }
      acc.push(wordSubstrings);
      return acc;
    },
    []
  )
  // console.log(substringsPerWord);
  const shortestUniqueSubstringsPerWord = substringsPerWord.reduce<UniqueSubstrings>(
    (acc, wordSubstringsSet, index) => {
      const word = words[index];
      let shortestUniqueSubstring;
      // A Set in JavaScript preserves insertion order - so these return in increasing size
      wordLoop: for (const substring of wordSubstringsSet) {
        let isUnique = true;
        isUniqueCheckLoop: for (const otherWordSet of substringsPerWord) {
          if (otherWordSet != wordSubstringsSet) {
            if (otherWordSet.has(substring)) {
              isUnique = false;
              break isUniqueCheckLoop;
            }
          }
        }
        if (isUnique) {
          shortestUniqueSubstring = substring
          break wordLoop;
        }
      }
      if (shortestUniqueSubstring) {
        acc[word] = shortestUniqueSubstring
      }
      return acc;
    },
    {}
  )
  // console.log(shortestUniqueSubstringsPerWord);
  return shortestUniqueSubstringsPerWord;
};

describe('getShortestUniqueSubstrings', () => {
  it('should return shortest unique substrings for the example input', () => {
    const input = ["cheapair", "cheapoair", "peloton", "pelican"];
    const result = getShortestUniqueSubstrings(input);

    const expected: UniqueSubstrings = {
      cheapair: "pa",
      cheapoair: "po",
      peloton: "t",
      pelican: "li"
    };

    assert.strictEqual(result["cheapair"], expected["cheapair"]);
    assert.strictEqual(result["cheapoair"], expected["cheapoair"]);
    assert.strictEqual(result["peloton"], expected["peloton"]);
    assert.strictEqual(result["pelican"], expected["pelican"]);
  });

  it('should handle simple non-overlapping words', () => {
    const input = ["apple", "banana", "carrot"];
    const result = getShortestUniqueSubstrings(input);

    const expected: UniqueSubstrings = {
      apple: "p",     // "p" doesn't appear in banana or carrot
      banana: "b",    // "b" unique to banana
      carrot: "c"     // "c" unique to carrot
    };

    assert.strictEqual(result["apple"], expected["apple"]);
    assert.strictEqual(result["banana"], expected["banana"]);
    assert.strictEqual(result["carrot"], expected["carrot"]);
  });

  it('should handle identical words', () => {
    const input = ["test", "test"];
    const result = getShortestUniqueSubstrings(input);

    // No unique substrings since words are identical
    assert.deepStrictEqual(result, {});
  });

  it('should handle one word being a substring of another', () => {
    const input = ["book", "bookstore"];
    const result = getShortestUniqueSubstrings(input);

    // "book" is a substring of "bookstore", so no unique substrings
    assert.ok(!("book" in result));

    // "bookstore" unique substring could be "s"
    assert.strictEqual(result["bookstore"], "s");
  });

  it('should handle words that are permutations', () => {
    const input = ["abc", "bca", "cab"];
    const result = getShortestUniqueSubstrings(input);

    // No substring shorter than full word is unique; expect full words
    const expected: UniqueSubstrings = {
      abc: "abc",
      bca: "bca",
      cab: "cab"
    };

    assert.strictEqual(result["abc"], expected["abc"]);
    assert.strictEqual(result["bca"], expected["bca"]);
    assert.strictEqual(result["cab"], expected["cab"]);
  });

  it('should handle single-letter words', () => {
    const input = ["a", "b", "c"];
    const result = getShortestUniqueSubstrings(input);

    const expected: UniqueSubstrings = {
      a: "a",
      b: "b",
      c: "c"
    };

    assert.strictEqual(result["a"], expected["a"]);
    assert.strictEqual(result["b"], expected["b"]);
    assert.strictEqual(result["c"], expected["c"]);
  });

  it('should handle empty input', () => {
    const input: Word[] = [];
    const result = getShortestUniqueSubstrings(input);

    assert.deepStrictEqual(result, {});
  });

  it('should handle only one word', () => {
    const input = ["onlyone"];
    const result = getShortestUniqueSubstrings(input);

    // The shortest unique substring could be the first letter
    assert.strictEqual(result["onlyone"], "o");
  });

  it('should handle words with shared prefixes or suffixes', () => {
    const input = ["start", "stark", "starfish"];
    const result = getShortestUniqueSubstrings(input);

    const expected: UniqueSubstrings = {
      start: "rt",
      stark: "k",
      starfish: "f"
    };

    assert.strictEqual(result["start"], expected["start"]);
    assert.strictEqual(result["stark"], expected["stark"]);
    assert.strictEqual(result["starfish"], expected["starfish"]);
  });

  it('should handle words with all overlapping substrings', () => {
    const input = ["aaa", "aaa"];
    const result = getShortestUniqueSubstrings(input);

    // No unique substrings possible
    assert.deepStrictEqual(result, {});
  });

  it('should handle different word lengths', () => {
    const input = ["a", "alphabet", "alphanumeric"];
    const result = getShortestUniqueSubstrings(input);

    const expected: UniqueSubstrings = {
      alphabet: "b",
      alphanumeric: "n"
    };

    assert.strictEqual(result["a"], undefined);
    assert.strictEqual(result["alphabet"], expected["alphabet"]);
    assert.strictEqual(result["alphanumeric"], expected["alphanumeric"]);
  });
});

mocha.run();
