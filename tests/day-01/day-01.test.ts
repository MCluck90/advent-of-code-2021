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

    test('with example data', () => {
      const testData = load('test-1')
      expect(countMeasurementIncreases(testData)).toBe(7)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(countMeasurementIncreases(testData)).toBe(1529)
    })
  })
  describe('Part 2', () => {
    function countMeasurementWindowIncreases(input: string): number {
      const measurements = input.split('\n').map((n) => Number(n))

      const rollingMeasurement = [0, 0, 0, 0]
      const windows: number[][] = [[], [], [], []]
      for (let i = 0; i <= measurements.length; i++) {
        const measurement = measurements[i]
        for (let j = 0; j < 4; j++) {
          if (i > j - 1) {
            if (i > 0 && (i - j) % 4 === 3) {
              windows[j].push(rollingMeasurement[j])
              rollingMeasurement[j] = 0
            } else {
              rollingMeasurement[j] += measurement
            }
          }
        }
      }

      let increases = 0
      for (let i = 1; ; i++) {
        const j = i - 1
        const row = Math.floor(i / 4)
        const prevRow = Math.floor(j / 4)
        const column = i % 4
        const prevColumn = j % 4
        const value = windows[column][row]
        const prevValue = windows[prevColumn][prevRow]
        if (value === undefined) {
          break
        }

        if (value > prevValue) {
          increases++
        }
      }

      return increases
    }

    test('with example data', () => {
      const testData = load('test-2')
      expect(countMeasurementWindowIncreases(testData)).toBe(5)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(countMeasurementWindowIncreases(testData)).toBe(1567)
    })
  })
})
