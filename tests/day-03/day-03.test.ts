import * as path from 'path'
import { readFileSync } from 'fs'

const parse = (input: string): number[][] =>
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

describe('Day 2: Dive!', () => {
  describe('Part 1', () => {
    function solution(data: number[][]): number {
      const totals = data.reduce((acc, row) => acc.map((x, i) => x + row[i]))

      const half = Math.floor(data.length / 2)
      const gammaBitSequence = totals.map((n) => (n > half ? 1 : 0))
      const gammaValue = parseInt(gammaBitSequence.join(''), 2)

      const epsilonBitSequence = totals.map((n) => (n <= half ? 1 : 0))
      const epsilonValue = parseInt(epsilonBitSequence.join(''), 2)
      return gammaValue * epsilonValue
    }

    test('with example data', () => {
      const testData = load('test-1')
      expect(solution(testData)).toBe(198)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(3242606)
    })
  })

  xdescribe('Part 2', () => {
    function solution(data: number[][]): number {
      return 0
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
