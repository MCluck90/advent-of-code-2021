import * as path from 'path'
import { readFileSync } from 'fs'

type Input = number[]

const parse = (input: string): Input => input.split(',').map(Number).sort()

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

describe('Day 6: Lanternfish', () => {
  describe('Part 1', () => {
    function solution(input: Input): number {
      const population = new Array(9).fill(0)
      for (const n of input) {
        population[n]++
      }

      for (let day = 0; day < 80; day++) {
        const n = population.shift()
        population.push(n)
        population[6] += n
      }

      return population.reduce((x, y) => x + y)
    }

    test('with example data', () => {
      const testData = load('test-1')
      expect(solution(testData)).toBe(5934)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(345387)
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
