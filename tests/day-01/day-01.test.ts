import * as path from 'path'
import { readFileSync } from 'fs'

const load = (type: 'test-1' | 'test-2' | 'puzzle') => {
  const filePath = path.join(
    __dirname,
    type === 'test-1'
      ? 'test-data.part-1.txt'
      : type === 'test-2'
      ? 'test-data.part-2.txt'
      : 'puzzle-input.txt'
  )
  return readFileSync(filePath).toString()
}

describe('Day 1: Sonar Sweep', () => {
  describe('Part 1', () => {
    function solution(input: string): number {
      const measurements = input.split('\n').map((n) => Number(n))
      let increases = 0
      for (let i = 1; i < measurements.length; i++) {
        if (measurements[i] > measurements[i - 1]) {
          increases += 1
        }
      }
      return increases
    }

    test('with example data', () => {
      const testData = load('test-1')
      expect(solution(testData)).toBe(7)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(1529)
    })
  })
  describe('Part 2', () => {
    function solution(input: string): number {
      const measurements = input.split('\n').map((n) => Number(n))
      const windows: number[] = []
      for (let i = 2; i < measurements.length; i++) {
        windows.push(
          measurements[i] + measurements[i - 1] + measurements[i - 2]
        )
      }

      let increases = 0
      for (let i = 1; i < windows.length; i++) {
        if (windows[i] > windows[i - 1]) {
          increases += 1
        }
      }
      return increases
    }

    test('with example data', () => {
      const testData = load('test-2')
      expect(solution(testData)).toBe(5)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(1567)
    })
  })
})
