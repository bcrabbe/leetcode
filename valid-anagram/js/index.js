const _ = require('lodash')
const R = require('ramda')
const Mocha = require('mocha')
const assert = require('assert')

const mocha = new Mocha()
// Bit of a hack, sorry!
mocha.suite.emit('pre-require', this, 'solution', mocha)

// https://leetcode.com/problems/valid-anagram/

// Given two strings s and t, return true if t is an anagram of s, and false otherwise.

// An Anagram is a word or phrase formed by rearranging the letters of a different word
// or phrase, typically using all the original letters exactly once.

const strToCharOccurences = (str) => Array.from(str).reduce(
  (acc, char) => {
    if (acc[char]) {
      acc[char] += 1
      return acc
    }
    acc[char] = 1
    return acc
  },
  {},
)

const differenceInCharOccurences = (s, t) => {
  const tCharOccurences = strToCharOccurences(t)
  return Array.from(s).reduce(
    (differences, char) => {
      if (tCharOccurences[char]) {
        tCharOccurences[char] -= 1
      } else {
        differences.push(char)
      }
      return differences
    },
    [],
  )
}

// is (thi)'s' string and anagram of (tha)'t'string (case insensitive)
const isAnagram = (input) => {
  const { s, t } = input ?? {}
  if (!s || !t) return undefined
  return differenceInCharOccurences(s, t).length === 0
}

describe('differenceInCharOccurences', () => {
  it('abbc abbc', () => {
    assert.deepEqual(differenceInCharOccurences('abbc', 'abbc'), [])
  })
  it('abbc, abbc, and some', () => {
    assert.deepEqual(differenceInCharOccurences('abbc', 'abbc, and some'), [])
  })
  it('abbcx, abbcdf', () => {
    assert.deepEqual(differenceInCharOccurences('abbcx', 'abbcdf'), ['x'])
  })
  it('abbbc, abbcdf', () => {
    assert.deepEqual(differenceInCharOccurences('abbbc', 'abbcdf'), ['b'])
  })
})

describe('strToCharOccurences', () => {
  it('aa b', () => {
    assert.deepEqual(strToCharOccurences('aa b'), {
      a: 2,
      ' ': 1,
      b: 1,
    })
    assert.deepEqual(R.countBy(R.toLower)('aa b'), {
      a: 2,
      ' ': 1,
      b: 1,
    })
  })
})

const examples = [{
  input: {
    s: 'anagram',
    t: 'nagaram',
  },
  output: true,
}, {
  input: {
    s: 'rat',
    t: 'car',
  },
  output: false,
}]

describe('solution', () => {
  it('should handle undefined', () => {
    assert.equal(isAnagram(undefined), undefined)
  })

  examples.map(
    ({ input, output }, ind) => it(`example ${ind + 1}`, () => {
      assert.equal(isAnagram(input), output)
    }),
  )
})

describe('Test suite', () => {
  it('should work', () => {
    assert.equal([1, 2, 3].length, 3)
  })
})

mocha.run()
