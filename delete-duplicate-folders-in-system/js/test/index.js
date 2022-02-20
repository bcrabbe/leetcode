const assert = require('assert')

const {
  deleteMarkedFiles,
  markDuplicateFiles,
  setPath,
  mapChildren,
  forChildren,
  pathsToFiles,
  indexWith,
  withoutKey,
  curry,
  arrayDiff,
  solution,
  foldChildren,
  initDir,
  mkdir,
  ls,
  getPath
} = require('../index.js')


describe('getPath', () => {
  var obj = { 'a': [{ 'b': { 'c': 3 } }] };

  it('work ', () => {
    assert.equal(getPath(obj, ['a', '0', 'b', 'c']), 3)
  })
  it('return undefined if not found ', () => {
    assert.equal(getPath(obj, ['a', '0', 'b', 'f']), undefined)
  })
  it('not thow any errors', () => {
    assert.equal(getPath({ a: undefined }, ['a', 'b']), undefined)
  })
})

describe('setPath', () => {
  var obj = { 'a': [{ 'b': { 'c': 3 } }] };

  it('create path to set', () => {
    assert.deepEqual(
      setPath({}, ['a', 0, 'b', 'c'], 4),
      { 'a': [{ 'b': { 'c': 4 } }] },
    )
  })
  it('show allow objects for value, and create them mid array', () => {
    assert.deepEqual(
      setPath({}, ['a', 0, 'b', 'd', 2], { worked: true }),
      { 'a': [{ 'b': { 'd': [, , { worked: true }] } }] },
    )
  })
  it('return undefined if not found ', () => {
    assert.deepEqual(setPath(obj, ['a', undefined, 'b', 'f'], 10), undefined)
  })
  it('not thow any errors', () => {
    assert.deepEqual(setPath({ a: undefined }, ['a', 'b'], 3), { a: { b: 3 } })
    assert.deepEqual(setPath(undefined, ['a', 'b'], 3), undefined)
  })
})

describe('curry', () => {
  const curriedConcat3 = curry(3, (a, b, c) => ([a, b, c]))

  it('all separate ', () => {
    assert.deepEqual(curriedConcat3('a')('b')('c'), ['a', 'b', 'c'])
  })
  it('2 then 1 ', () => {
    assert.deepEqual(curriedConcat3('a', 'b')('c'), ['a', 'b', 'c'])
  })
  it('all 3 ', () => {
    assert.deepEqual(curriedConcat3('a', 'b', 'c'), ['a', 'b', 'c'])
  })
})

describe('indexWith', () => {
  it('works', () => {
    assert.deepEqual(indexWith((a) => `${a * 2}`)([1, 2, 3]), { 2: 1, 4: 2, 6: 3 })
  })
})

describe('withoutKey', () => {
  it('works', () => {
    assert.deepEqual(withoutKey('a', { a: 'gone', b: 'remains' }), { b: 'remains' })
  })
})

describe('arrayDiff', () => {
  it('matches in order', () => {
    assert.deepEqual(arrayDiff((a) => `${a}`)([1, 2, 3], [1, 2, 3]), [])
  })
  it('matches ignoring order', () => {
    assert.deepEqual(arrayDiff((a) => `${a}`)([3, 1, 2], [1, 2, 3]), [])
  })
  it('finds extra in a', () => {
    assert.deepEqual(arrayDiff((a) => `${a}`)([3, 1, 2, 4], [1, 2, 3]), [4])
  })
  it('finds extra in b', () => {
    assert.deepEqual(arrayDiff((a) => `${a}`)([3, 1, 2], [1, 2, 3, 4]), [4])
  })
  it('handles empty b', () => {
    assert.deepEqual(arrayDiff((a) => `${a}`)([3, 1, 2], []), [3, 1, 2])
  })
  it('handles empty a', () => {
    assert.deepEqual(arrayDiff((a) => `${a}`)([], [1, 2, 3]), [1, 2, 3])
  })
  it('matches strings', () => {
    assert.deepEqual(
      arrayDiff(
        (a) => `${a}`
      )(
        [ [ 'd' ], [ 'd', 'a' ] ],
        [ [ 'd' ], [ 'd', 'a' ] ]
      ),
      [],
    )
  })
})

const mockPaths = () => ([['a'], ['c'], ['d'], ['a', 'b'], ['c', 'b'], ['d', 'a']])

const mockDirectory = () => ({
  files: {
    a: {
      files: {
        b: {
          files: {}
        }
      }
    },
    c: {
      files: {
        b: {
          files: {}
        }
      }
    },
    d: {
      files: {
        a: {
          files: {}
        }
      }
    }
  }
})

describe('pathsToFiles', () => {
  it('works', () => {
    const paths = mockPaths()
    const files = pathsToFiles(paths)
    assert.deepEqual(files, mockDirectory())
  })
})

describe('foldChildren', () => {
  it('works', () => {
    const files = mockDirectory()
    const fileNames = foldChildren(['/', files], [], (acc, [name, dir]) => ([...acc, `${name}`]))
    assert.deepEqual(fileNames, [
      '/', 'a', 'b',
      'c', 'b', 'd',
      'a'
    ])
  })
})

describe('mapChildren', () => {
  it('works', () => {
    const files = mockDirectory()
    const [, markedFiles] = mapChildren(
      ['/', files],
      ([name, dir]) => ([`${name}1`, { ...dir, marked: true }]),
    )
    assert.deepEqual(markedFiles, {
      marked: true,
      files: {
        a1: {
          marked: true,
          files: {
            b1: {
              marked: true,
              files: {}
            }
          }
        },
        c1: {
          marked: true,
          files: {
            b1: {
              marked: true,
              files: {}
            }
          }
        },
        d1: {
          marked: true,
          files: {
            a1: {
              marked: true,
              files: {}
            }
          }
        }
      }
    })
  })
  it('does not mutate', () => {
    const files = mockDirectory()
    const [, markedFiles] = mapChildren(
      ['/', files],
      ([name, dir]) => ([`${name}1`, { ...dir, marked: true }]),
    )
    assert.deepEqual(files, mockDirectory())
  })
})


describe('forChildren', () => {
  it('works', () => {
    const files = mockDirectory()
    forChildren(
      ['/', files],
      ([name, dir]) => {
        dir.marked = true
      },
    )
    assert.deepEqual(files, {
      marked: true,
      files: {
        a: {
          marked: true,
          files: {
            b: {
              marked: true,
              files: {}
            }
          }
        },
        c: {
          marked: true,
          files: {
            b: {
              marked: true,
              files: {}
            }
          }
        },
        d: {
          marked: true,
          files: {
            a: {
              marked: true,
              files: {}
            }
          }
        }
      }
    })
  })
})

describe('markDuplicateFiles', () => {
  it('works', () => {
    const files = mockDirectory()
    const markedFiles = markDuplicateFiles(files)
    assert.deepEqual(markedFiles, {
      files: {
        a: {
          duplicate: true,
          files: {
            b: {
              files: {}
            }
          }
        },
        c: {
          duplicate: true,
          files: {
            b: {
              files: {}
            }
          }
        },
        d: {
          files: {
            a: {
              files: {}
            }
          }
        }
      }
    })
  })
})

describe('deleteMarkedFiles', () => {
  it('works', () => {
    const markedFiles = {
      files: {
        a: {
          duplicate: true,
          files: {
            b: {
              files: {}
            }
          }
        },
        c: {
          duplicate: true,
          files: {
            b: {
              files: {}
            }
          }
        },
        d: {
          files: {
            a: {
              files: {}
            }
          }
        }
      }
    }
    assert.deepEqual(deleteMarkedFiles(markedFiles), {
      files: {
        d: {
          files: {
            a: {
              files: {}
            }
          }
        }
      }
    })
  })
})

describe('solution', () => {
  const examples = [{
    input: [['a'], ['c'], ['d'], ['a', 'b'], ['c', 'b'], ['d', 'a']],
    expected: [['d'], ['d', 'a']],
  }, {
    input: [['a'], ['c'], ['a', 'b'], ['c', 'b'], ['a', 'b', 'x'], ['a', 'b', 'x', 'y'], ['w'], ['w', 'y']],
    expected: [['c'], ['c', 'b'], ['a'], ['a', 'b']],
  }, {
    input: [["a","b"],["c","d"],["c"],["a"]],
    expected: [["c"],["c","d"],["a"],["a","b"]],
  }]

  const arrayDiffByString = arrayDiff((t) => `${t}`)

  return examples.map(
    ({ input, expected }, index) => it(
      `example${index + 1}`,
      () => {
        const result = solution(input)
        console.log('result', result)
        console.log('expected', expected)
        const mistakes = arrayDiffByString(result, expected)
        console.log('mistakes', mistakes)
        assert.deepEqual(mistakes, [])
      },
    ),
  )
})
