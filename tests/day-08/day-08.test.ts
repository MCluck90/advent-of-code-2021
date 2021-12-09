import * as path from 'path'
import { readFileSync } from 'fs'

type Display = {
  patterns: string[][]
  output: string[]
}

type Input = Display[]

const parse = (input: string): Input =>
  input
    .split('\n')
    .map((line) => line.split(' | '))
    .map(([patterns, output]) => ({
      patterns: patterns.split(' ').map((p) => p.split('')),
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

  describe('Part 2', () => {
    class WireBlock {
      private wires: string[]

      constructor(wires: string[]) {
        this.wires = wires
      }

      only() {
        if (this.wires.length !== 1) {
          throw new Error(
            `Expected to have 1 wire. Received "${this.wires.join(',')}"`
          )
        }

        return this.wires[0]
      }

      isSubSet(otherWires: string[]) {
        return this.wires.every((wire) => otherWires.includes(wire))
      }

      exclude(other: string): WireBlock
      exclude(other: WireBlock): WireBlock
      exclude(other: string | WireBlock) {
        if (other instanceof WireBlock) {
          return new WireBlock(
            this.wires.filter((wire) => !other.wires.includes(wire))
          )
        } else {
          return new WireBlock(this.wires.filter((wire) => wire !== other))
        }
      }

      and(other: WireBlock) {
        return new WireBlock(
          Array.from(new Set([...this.wires, ...other.wires]))
        )
      }

      with(other: string) {
        return new WireBlock(Array.from(new Set([...this.wires, other])))
      }

      isEqual(other: string[]) {
        return (
          other.length === this.wires.length &&
          other.every((wire) => this.wires.includes(wire))
        )
      }

      toString() {
        return this.wires.sort().join('')
      }
    }

    class PatternBlock {
      private patterns: string[][]

      constructor(patterns: string[][]) {
        this.patterns = patterns
      }

      withLength(length: number): PatternBlock {
        return new PatternBlock(
          this.patterns.filter((pattern) => pattern.length === length)
        )
      }

      only(): WireBlock {
        if (this.patterns.length !== 1) {
          throw new Error(
            `Expected to have 1 patterns. Found ${this.patterns.length}`
          )
        }

        return new WireBlock(this.patterns[0])
      }

      includes(other: string): PatternBlock
      includes(other: WireBlock): PatternBlock
      includes(other: string | WireBlock) {
        if (other instanceof WireBlock) {
          return new PatternBlock(
            this.patterns.filter((wires) => other.isSubSet(wires))
          )
        } else {
          return new PatternBlock(
            this.patterns.filter((wires) =>
              wires.some((wire) => wire === other)
            )
          )
        }
      }

      exclude(other: string): PatternBlock
      exclude(other: WireBlock): PatternBlock
      exclude(other: string | WireBlock) {
        if (other instanceof WireBlock) {
          return new PatternBlock(
            this.patterns.filter((wires) => !other.isEqual(wires))
          )
        } else {
          return new PatternBlock(
            this.patterns.filter((wires) => !wires.includes(other))
          )
        }
      }

      with(other: string) {
        return new PatternBlock(
          this.patterns.map((wires) => Array.from(new Set([...wires, other])))
        )
      }
    }

    function solution(input: Input): number {
      function getOutput(display: Display): number {
        const patterns = new PatternBlock(display.patterns)
        const one = patterns.withLength(2).only()
        const four = patterns.withLength(4).only()
        const seven = patterns.withLength(3).only()
        const eight = patterns.withLength(7).only()

        const topWire = seven.exclude(four).only()

        const withSixWires = patterns.withLength(6)
        const nine = withSixWires.includes(four).includes(seven).only()

        const bottomWire = nine.exclude(four).exclude(seven).only()

        const withFiveWires = patterns.withLength(5)
        const three = withFiveWires
          .includes(one)
          .includes(topWire)
          .includes(bottomWire)
          .only()

        const centerWire = three
          .exclude(one)
          .exclude(topWire)
          .exclude(bottomWire)
          .only()
        const topLeftWire = four.exclude(one).exclude(centerWire).only()

        const zero = withSixWires.exclude(centerWire).only()
        const six = withSixWires.exclude(zero).exclude(nine).only()

        const five = withFiveWires.includes(topLeftWire).only()
        const two = withFiveWires.exclude(three).exclude(five).only()

        const toString: Record<string, string> = {
          [zero.toString()]: '0',
          [one.toString()]: '1',
          [two.toString()]: '2',
          [three.toString()]: '3',
          [four.toString()]: '4',
          [five.toString()]: '5',
          [six.toString()]: '6',
          [seven.toString()]: '7',
          [eight.toString()]: '8',
          [nine.toString()]: '9',
        }

        return Number(
          display.output.reduce(
            (prev, current) =>
              prev + toString[current.split('').sort().join('')],
            ''
          )
        )
      }

      return input.reduce((acc, display) => acc + getOutput(display), 0)
    }

    test('with example data', () => {
      const testData = load('test-2')
      expect(solution(testData)).toBe(61229)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(961734)
    })
  })
})
