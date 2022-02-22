const _ = require('lodash')
const R = require('ramda')
const Mocha = require('mocha')
const assert = require('assert')

const mocha = new Mocha()

// Bit of a hack, sorry!
mocha.suite.emit('pre-require', this, 'solution', mocha)

// https://leetcode.com/problems/rotate-string
// Given two strings s and goal, return true if and only if s can become goal
// after some number of shifts on s.
// A shift on s consists of moving the leftmost character of s to the rightmost position.
// For example, if s = "abcde", then it will be "bcdea" after one shift.
const isShiftedMatch = (s, goal) => {
  if(!s || !goal) return undefined
  if (s.length !== goal.length) return false
  const doubledGoal = goal.concat(goal)
  return doubledGoal.indexOf(s) !== -1
}

const example1 = {
  input: {
    s: 'abcde',
    goal: 'cdeab',
  },
  output: true,
}
const example2 = {
  input: {
    s: 'abcde',
    goal: 'abced',
  },
  output: false,
}

describe('isShiftedMatch', () => {
  it('should handle undefined', () => {
    assert.equal(isShiftedMatch(undefined, undefined), undefined)
    assert.equal(isShiftedMatch('abc', undefined), undefined)
    assert.equal(isShiftedMatch(undefined, 'abc'), undefined)
  })
  it('should return undefined for empty strings', () => {
    assert.equal(isShiftedMatch('', 'abc'), undefined)
    assert.equal(isShiftedMatch('abc', ''), undefined)
    assert.equal(isShiftedMatch('', 'abc'), undefined)
  })
  it('example1', () => {
    const { input: { s, goal }, output } = example1
    assert.equal(isShiftedMatch(s, goal), output)
  })
  it('example2', () => {
    const { input: { s, goal }, output } = example2
    assert.equal(isShiftedMatch(s, goal), output)
  })
  it('length mismatch', () => {
    assert.equal(isShiftedMatch('goal', 'olg'), false)
  })
})

mocha.run()
