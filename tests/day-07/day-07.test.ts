import * as path from 'path'
import { readFileSync } from 'fs'

type Input = number[]

const parse = (input: string): Input => input.split(',').map(Number)

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

describe('Day 7: The Treachery of Whales', () => {
  describe('Part 1', () => {
    function solution(input: Input): number {
      const min = Math.min(...input)
      const max = Math.max(...input)
      let minSum = Infinity
      for (let n = min; n <= max; n++) {
        let sum = 0

        for (const n1 of input) {
          sum += Math.abs(n - n1)
        }

        minSum = Math.min(sum, minSum)
      }

      return minSum
    }

    test('with example data', () => {
      const testData = load('test-1')
      expect(solution(testData)).toBe(37)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(323647)
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
