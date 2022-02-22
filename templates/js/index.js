const _ = require('lodash')
const R = require('ramda')
const Mocha = require('mocha')
const assert = require('assert')

const mocha = new Mocha()

// Bit of a hack, sorry!
mocha.suite.emit('pre-require', this, 'solution', mocha)

describe('Test suite', () => {
  it('should work', () => {
    assert.equal([1, 2, 3].length, 3)
  })
})

mocha.run()
