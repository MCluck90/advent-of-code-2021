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

const getMostCommon = (data: number[][], column?: number) =>
  data
    .reduce((acc, row) => acc.map((x, i) => x + row[i]))
    .map((n) => (n >= data.length / 2 ? 1 : 0))

const invert = (binary: number[]) => binary.map((n) => (n === 1 ? 0 : 1))

const toDecimal = (binary: number[]) => parseInt(binary.join(''), 2)

describe('Day 3: Binary Diagnostic', () => {
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

  describe('Part 2', () => {
    function solution(data: number[][]): number {
      let oxygenSearchSpace = data
      let co2SearchSpace = data
      for (let i = 0; i < data.length; i++) {
        if (oxygenSearchSpace.length > 1) {
          const mostCommon = getMostCommon(oxygenSearchSpace)[i]
          oxygenSearchSpace = oxygenSearchSpace.filter(
            (row) => row[i] === mostCommon
          )
        }
        if (co2SearchSpace.length > 1) {
          const leastCommon = invert(getMostCommon(co2SearchSpace))[i]
          co2SearchSpace = co2SearchSpace.filter(
            (row) => row[i] === leastCommon
          )
        }
      }

      const oxygenGeneratorRating = toDecimal(oxygenSearchSpace[0])
      const co2ScrubberRating = toDecimal(co2SearchSpace[0])
      return oxygenGeneratorRating * co2ScrubberRating
    }

    test('with example data', () => {
      const testData = load('test-2')
      expect(solution(testData)).toBe(230)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(4856080)
    })
  })
})
