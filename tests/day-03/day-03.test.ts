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

const getMostCommon = (data: number[][]) =>
  data
    .reduce((acc, row) => acc.map((x, i) => x + row[i]))
    .map((n) => (n > data.length / 2 ? 1 : 0))

const invert = (binary: number[]) => binary.map((n) => (n === 1 ? 0 : 1))

const toDecimal = (binary: number[]) => parseInt(binary.join(''), 2)

describe('Day 2: Dive!', () => {
  describe('Part 1', () => {
    function solution(data: number[][]): number {
      const mostCommon = getMostCommon(data)
      const leastCommon = invert(mostCommon)
      const gamma = toDecimal(mostCommon)
      const epsilon = toDecimal(leastCommon)
      return gamma * epsilon
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
