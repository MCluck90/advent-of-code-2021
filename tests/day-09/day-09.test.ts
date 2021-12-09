import * as path from 'path'
import { readFileSync } from 'fs'

type Input = number[][]

const parse = (input: string): Input =>
  input.split('\n').map((line) => line.split('').map(Number))

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

describe('Day 9: Smoke Basin', () => {
  describe('Part 1', () => {
    function solution(input: Input): number {
      const getNeighbors = (x: number, y: number) =>
        [
          input[y - 1]?.[x],
          input[y + 1]?.[x],
          input[y]?.[x - 1],
          input[y]?.[x + 1],
        ].filter((x) => x !== undefined)
      const lowestPoints: number[] = []
      const isLowestPoint = (value: number, x: number, y: number) =>
        getNeighbors(x, y).every((n) => value < n)

      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
          const value = input[y][x]
          if (isLowestPoint(value, x, y)) {
            lowestPoints.push(value)
          }
        }
      }

      return lowestPoints.reduce((acc, n) => acc + n + 1, 0)
    }

    test('with example data', () => {
      const testData = load('test-1')
      expect(solution(testData)).toBe(15)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(607)
    })
  })

  describe('Part 2', () => {
    function solution(input: Input) {
      const visited = new Set<string>()
      const hasVisited = (x: number, y: number) => visited.has(`${x},${y}`)
      const visit = (x: number, y: number) => {
        visited.add(`${x},${y}`)
      }

      function floodFill(x: number, y: number): number {
        if (hasVisited(x, y)) {
          return 0
        }

        visit(x, y)
        const value = input[y]?.[x]
        if (value === undefined || value === 9) {
          return 0
        }

        return (
          floodFill(x - 1, y) +
          floodFill(x + 1, y) +
          floodFill(x, y - 1) +
          floodFill(x, y + 1) +
          1
        )
      }

      const basins: number[] = []
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
          const value = input[y][x]
          if (value === 9 || hasVisited(x, y)) {
            continue
          }

          basins.push(floodFill(x, y))
        }
      }

      return basins
        .sort((a, b) => (a < b ? 1 : -1))
        .slice(0, 3)
        .reduce((prev, curr) => prev * curr)
    }

    test('with example data', () => {
      const testData = load('test-2')
      expect(solution(testData)).toBe(1134)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(900864)
    })
  })
})
