import * as path from 'path'
import { readFileSync } from 'fs'
type Direction = 'forward' | 'down' | 'up'

const parse = (input: string): [Direction, number][] =>
  input.split('\n').map((line) => {
    const [direction, units] = line.split(' ')
    return [direction as Direction, Number(units)]
  })

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
    function solution(commands: [Direction, number][]): number {
      const directionToMultiplier: Record<Direction, [number, number]> = {
        forward: [1, 0],
        down: [0, 1],
        up: [0, -1],
      }

      let x = 0
      let y = 0
      for (const [direction, units] of commands) {
        const [xMultiplier, yMultiplier] = directionToMultiplier[direction]
        x += units * xMultiplier
        y += units * yMultiplier
      }
      return x * y
    }

    test('with example data', () => {
      const testData = load('test-1')
      expect(solution(testData)).toBe(150)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(1383564)
    })
  })

  describe('Part 2', () => {
    function solution(commands: [Direction, number][]): number {
      let aim = 0
      let x = 0
      let y = 0
      for (const [direction, units] of commands) {
        switch (direction) {
          case 'down':
            aim += units
            break

          case 'up':
            aim -= units
            break

          case 'forward':
            x += units
            y += aim * units
            break
        }
      }
      return x * y
    }

    test('with example data', () => {
      const testData = load('test-2')
      expect(solution(testData)).toBe(900)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(1488311643)
    })
  })
})
