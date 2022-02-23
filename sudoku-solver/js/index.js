// https://leetcode.com/problems/sudoku-solver/

const R = require('ramda')
const _ = require('lodash')
const assert = require('assert')

const isComplete = (board) => board.find((row) => row.includes('.')) === undefined

const squareIndex = (columnIndex, rowIndex) => Math.floor(columnIndex / 3)
      + (Math.floor(rowIndex / 3) * 3)

const toLookups = (board) => ({
  rows: board.map(
    (row, rowIndex) => row.reduce(
      (acc, square, columnIndex) => {
        if (square !== '.') {
          return {
            ...acc,
            [square]: [columnIndex, rowIndex],
          }
        }
        return acc
      },
      {},
    ),
  ),
  columns: R.transpose(board).map(
    (row, rowIndex) => row.reduce(
      (acc, square, columnIndex) => {
        if (square !== '.') {
          return {
            ...acc,
            [square]: [columnIndex, rowIndex],
          }
        }
        return acc
      },
      {},
    ),
  ),
  squares: board.reduce(
    (acc, row, rowIndex) => row.reduce(
      (rowAcc, square, columnIndex) => {
        const index = squareIndex(columnIndex, rowIndex)
        if (square !== '.') {
          rowAcc[index] = {
            ...rowAcc[index],
            [square]: [columnIndex, rowIndex],
          }
        }
        return rowAcc
      },
      acc,
    ),
    board.map(() => ({})),
  ),
})

const optionsForSquare = ({
  rows,
  columns,
  squares,
}, [i, j]) => {
  const notOptions = {
    ...rows[i],
    ...columns[j],
    ...squares[squareIndex(j, i)],
  }
  return R.differenceWith((a, b) => a == b)(R.range(1, 10), Object.keys(notOptions))
}

const solveSudoku = (board) => {
  const solvingBoard = R.clone(board)
  const lookups = toLookups(board)
  const { rows, columns, squares } = lookups
  let iterations = 0
  while (!isComplete(solvingBoard)) {
    iterations += 1
    console.log(`iteration ${iterations}`)
    console.log(solvingBoard)
    for (let i = 0; i < board.length; i += 1) {
      for (let j = 0; j < board.length; j += 1) {
        if (board[i][j] === '.') {
          const options = optionsForSquare(lookups, [i, j])
          if (options.length === 1) {
            const [onlyOption] = options
            solvingBoard[i][j] = onlyOption

            rows[i] = {
              ...rows[i],
              [onlyOption]: [j, i],
            }
            columns[j] = {
              ...columns[j],
              [onlyOption]: [j, i],
            }
            squares[squareIndex(j, i)] = {
              ...squares[squareIndex(j, i)],
              [onlyOption]: [j, i],
            }
          }
        }
      }
    }
  }
  return solvingBoard
}

const examples = () => ({
  input: [
    ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
    ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
    ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
    ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
    ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
    ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
    ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
    ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
    ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
  ],
  expected: [
    ['5', '3', '4', '6', '7', '8', '9', '1', '2'],
    ['6', '7', '2', '1', '9', '5', '3', '4', '8'],
    ['1', '9', '8', '3', '4', '2', '5', '6', '7'],
    ['8', '5', '9', '7', '6', '1', '4', '2', '3'],
    ['4', '2', '6', '8', '5', '3', '7', '9', '1'],
    ['7', '1', '3', '9', '2', '4', '8', '5', '6'],
    ['9', '6', '1', '5', '3', '7', '2', '8', '4'],
    ['2', '8', '7', '4', '1', '9', '6', '3', '5'],
    ['3', '4', '5', '2', '8', '6', '1', '7', '9'],
  ],
})

describe('solveSudoku', () => {
  const { input, expected } = examples()

  it('example1', () => {
    assert.deepEqual(solveSudoku(input), expected)
  })
})

describe('optionsForSquare', () => {
  const { input } = examples()
  const lookups = toLookups(input)

  it('work', () => {
    assert.deepEqual(optionsForSquare(lookups, [2, 0]), [1, 2])
  })
})

describe('squareIndex', () => {
  // top row
  R.xprod(_.range(9), _.range(3)).map(
    ([columnIndex, rowIndex]) => it(
      `${columnIndex}, ${rowIndex} should be ${Math.floor(columnIndex / 3)}`,
      () => assert.equal(
        squareIndex(columnIndex, rowIndex),
        Math.floor(columnIndex / 3),
      ),
    ),
  )
  // middle
  R.xprod(_.range(9), _.range(3, 6)).map(
    ([columnIndex, rowIndex]) => it(
      `${columnIndex}, ${rowIndex} should be ${3 + Math.floor(columnIndex / 3)}`,
      () => assert.equal(
        squareIndex(columnIndex, rowIndex),
        3 + Math.floor(columnIndex / 3),
      ),
    ),
  )
  // bottom
  R.xprod(_.range(9), _.range(6, 9)).map(
    ([columnIndex, rowIndex]) => it(
      `${columnIndex}, ${rowIndex} should be ${6 + Math.floor(columnIndex / 3)}`,
      () => assert.equal(
        squareIndex(columnIndex, rowIndex),
        6 + Math.floor(columnIndex / 3),
      ),
    ),
  )
})

describe('isComplete', () => {
  const { input: incomplete, expected: complete } = examples()
  it('finds incomplete', () => {
    assert.equal(isComplete(incomplete), false)
  })
  it('finds complete', () => {
    assert.equal(isComplete(complete), true)
  })
})

describe('toLookups', () => {
  const { input } = examples()
  const { rows, columns, squares } = toLookups(input)
  it('rows', () => {
    assert.deepEqual(
      rows, [
        { '3': [1, 0], '5': [0, 0], '7': [4, 0] },
        { '1': [3, 1], '5': [5, 1], '6': [0, 1], '9': [4, 1] },
        { '6': [7, 2], '8': [2, 2], '9': [1, 2] },
        { '3': [8, 3], '6': [4, 3], '8': [0, 3] },
        { '1': [8, 4], '3': [5, 4], '4': [0, 4], '8': [3, 4] },
        { '2': [4, 5], '6': [8, 5], '7': [0, 5] },
        { '2': [6, 6], '6': [1, 6], '8': [7, 6] },
        { '1': [4, 7], '4': [3, 7], '5': [8, 7], '9': [5, 7] },
        { '7': [7, 8], '8': [4, 8], '9': [8, 8] }
     ])
  })
  it('columns', () => {
    assert.deepEqual(
      columns, [
        {
          '4': [4, 0],
          '5': [0, 0],
          '6': [1, 0],
          '7': [5, 0],
          '8': [3, 0]
        },
        { '3': [0, 1], '6': [6, 1], '9': [2, 1] },
        { '8': [2, 2] },
        { '1': [1, 3], '4': [7, 3], '8': [4, 3] },
        {
          '1': [7, 4],
          '2': [5, 4],
          '6': [3, 4],
          '7': [0, 4],
          '8': [8, 4],
          '9': [1, 4]
        },
        { '3': [4, 5], '5': [1, 5], '9': [7, 5] },
        { '2': [6, 6] },
        { '6': [2, 7], '7': [8, 7], '8': [6, 7] },
        {
          '1': [4, 8],
          '3': [3, 8],
          '5': [7, 8],
          '6': [5, 8],
          '9': [8, 8]
        }
     ])
  })
  it('squares', () => {
    assert.deepEqual(
      squares, [
        {
          '3': [1, 0],
          '5': [0, 0],
          '6': [0, 1],
          '8': [2, 2],
          '9': [1, 2]
        },
        { '1': [3, 1], '5': [5, 1], '7': [4, 0], '9': [4, 1] },
        { '6': [7, 2] },
        { '4': [0, 4], '7': [0, 5], '8': [0, 3] },
        { '2': [4, 5], '3': [5, 4], '6': [4, 3], '8': [3, 4] },
        { '1': [8, 4], '3': [8, 3], '6': [8, 5] },
        { '6': [1, 6] },
        { '1': [4, 7], '4': [3, 7], '8': [4, 8], '9': [5, 7] },
        {
          '2': [6, 6],
          '5': [8, 7],
          '7': [7, 8],
          '8': [7, 6],
          '9': [8, 8]
        }
     ])
  })
})
