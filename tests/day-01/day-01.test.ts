import * as path from 'path'
import { readFileSync } from 'fs'

function countMeasurementIncreases(input: string): number {
  const measurements = input.split('\n').map((n) => Number(n))
  let previousMeasurement = Infinity
  let increases = 0
  for (const measurement of measurements) {
    if (measurement > previousMeasurement) {
      increases++
    }
    previousMeasurement = measurement
  }
  return increases
}

const load = (part: 1 | 2, type: 'test' | 'puzzle') => {
  const filePath = path.join(
    __dirname,
    part === 1 ? 'part-1' : 'part-2',
    type === 'test' ? 'test-data.txt' : 'puzzle-input.txt'
  )
  return readFileSync(filePath).toString()
}

describe('Day 1: Sonar Sweep', () => {
  describe('Part 1', () => {
    test('with example data', () => {
      const testData = load(1, 'test')
      expect(countMeasurementIncreases(testData)).toBe(7)
    })

    test('with puzzle input', () => {
      const testData = load(1, 'puzzle')
      expect(countMeasurementIncreases(testData)).toBe(1529)
    })
  })
})
