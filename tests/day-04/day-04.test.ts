import * as path from 'path'
import { readFileSync } from 'fs'

type Row<T = number> = [T, T, T, T, T]
type Board<T = number> = [Row<T>, Row<T>, Row<T>, Row<T>, Row<T>]

interface Input {
  numbersToDraw: number[]
  boards: Board[]
}

const createBoard = <T>(initialValue: T): Board<T> => [
  [initialValue, initialValue, initialValue, initialValue, initialValue],
  [initialValue, initialValue, initialValue, initialValue, initialValue],
  [initialValue, initialValue, initialValue, initialValue, initialValue],
  [initialValue, initialValue, initialValue, initialValue, initialValue],
  [initialValue, initialValue, initialValue, initialValue, initialValue],
]

const parse = (input: string): Input => {
  const [numbersToDrawLine, , ...lines] = input.split('\n')
  const boards: Board[] = []
  let latestBoard = createBoard(0)

  const numbersToDraw = numbersToDrawLine.split(',').map(Number)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) {
      boards.push(latestBoard)
      latestBoard = createBoard(0)
      continue
    }

    const numbers = line
      .split(' ')
      .filter((n) => !!n)
      .map(Number) as Row
    const index = i % 6
    latestBoard[index] = numbers
  }
  boards.push(latestBoard)

  return {
    numbersToDraw,
    boards,
  }
}

const load = (type: 'test-1' | 'test-2' | 'puzzle') => {
  const filePath = path.join(
    __dirname,
    type === 'test-1'
      ? 'test-data.part-1.txt'
      : type === 'test-2'
      ? 'test-data.part-2.txt'
      : 'puzzle-input.txt'
  )
  return parse(readFileSync(filePath).toString())
}

const hasWon = (board: Board<boolean>) => {
  const isTrue = (x: boolean) => x
  // Check rows
  for (const row of board) {
    if (row.every(isTrue)) {
      return true
    }
  }

  // Check columns
  for (let i = 0; i < board.length; i++) {
    const column = board.map((row) => row[i])
    if (column.every(isTrue)) {
      return true
    }
  }
  return false
}

const getScore = (board: Board, answers: Board<boolean>) => {
  let score = 0
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (!answers[y][x]) {
        score += board[y][x]
      }
    }
  }
  return score
}

describe('Day 4: Giant Squid', () => {
  describe('Part 1', () => {
    function solution({ boards, numbersToDraw }: Input): number {
      const answeredBoards = boards.map(() => createBoard(false))
      for (const n of numbersToDraw) {
        for (let y = 0; y < 5; y++) {
          for (let x = 0; x < 5; x++) {
            for (let i = 0; i < boards.length; i++) {
              if (boards[i][y][x] === n) {
                answeredBoards[i][y][x] = true
              }
            }
          }
        }

        let winningBoard: { board: Board; answers: Board<boolean> } | null =
          null
        for (let i = 0; i < boards.length; i++) {
          if (hasWon(answeredBoards[i])) {
            winningBoard = {
              board: boards[i],
              answers: answeredBoards[i],
            }
            break
          }
        }

        if (winningBoard) {
          return getScore(winningBoard.board, winningBoard.answers) * n
        }
      }
      return 0
    }

    test('with example data', () => {
      const testData = load('test-1')
      expect(solution(testData)).toBe(4512)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(69579)
    })
  })

  describe('Part 2', () => {
    function solution({ boards, numbersToDraw }: Input): number {
      const answeredBoards = boards.map(() => createBoard(false))
      const boardsWithAWin: number[] = []
      for (const n of numbersToDraw) {
        for (let y = 0; y < 5; y++) {
          for (let x = 0; x < 5; x++) {
            for (let i = 0; i < boards.length; i++) {
              if (boards[i][y][x] === n) {
                answeredBoards[i][y][x] = true
              }
            }
          }
        }

        for (let i = 0; i < boards.length; i++) {
          if (!boardsWithAWin.includes(i) && hasWon(answeredBoards[i])) {
            boardsWithAWin.push(i)
          }
        }

        if (boardsWithAWin.length === boards.length) {
          const indexOfLastWinningBoard =
            boardsWithAWin[boardsWithAWin.length - 1]
          const lastWinningBoard = boards[indexOfLastWinningBoard]
          const lastWinningBoardAnswers =
            answeredBoards[indexOfLastWinningBoard]
          return getScore(lastWinningBoard, lastWinningBoardAnswers) * n
        }
      }
      return 0
    }

    test('with example data', () => {
      const testData = load('test-2')
      expect(solution(testData)).toBe(1924)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(14877)
    })
  })
})
