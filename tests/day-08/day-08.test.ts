import * as path from 'path'
import { readFileSync } from 'fs'

type Input = {
  patterns: string[]
  output: string[]
}[]

const parse = (input: string): Input =>
  input
    .split('\n')
    .map((line) => line.split(' | '))
    .map(([patterns, output]) => ({
      patterns: patterns.split(' '),
      output: output.split(' '),
    }))

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

describe('Day 8: Seven Segment Search', () => {
  describe('Part 1', () => {
    function solution(input: Input): number {
      const hasXSegments = (digit: string, x: number) =>
        digit.length === x ? 1 : 0
      return input.reduce((acc, { output }) => {
        return (
          acc +
          output.reduce(
            (altAcc, digit) =>
              altAcc +
              hasXSegments(digit, 2) +
              hasXSegments(digit, 4) +
              hasXSegments(digit, 3) +
              hasXSegments(digit, 7),
            0
          )
        )
      }, 0)
    }

    test('with example data', () => {
      const testData = load('test-1')
      expect(solution(testData)).toBe(26)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(303)
    })
  })

  xdescribe('Part 2', () => {
    function solution(input: Input): number {
      return -1
    }

    test('with example data', () => {
      const testData = load('test-2')
      expect(solution(testData)).toBe(61229)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(0)
    })
  })
})
