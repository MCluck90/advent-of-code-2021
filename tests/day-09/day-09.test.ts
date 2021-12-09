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

      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
          const value = input[y][x]
          const neighbors = getNeighbors(x, y)
          if (neighbors.every((n) => value < n)) {
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

  xdescribe('Part 2', () => {
    function solution(input: Input): number {
      return -1
    }

    test('with example data', () => {
      const testData = load('test-2')
      expect(solution(testData)).toBe(0)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(0)
    })
  })
})
