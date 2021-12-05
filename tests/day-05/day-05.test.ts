import * as path from 'path'
import { readFileSync } from 'fs'

interface Point {
  x: number
  y: number
}

interface LineSegment {
  start: Point
  end: Point
}
type Input = LineSegment[]

const parse = (input: string): Input => {
  const lines = input.split('\n')
  const toPoint = (str: string) => {
    const [x, y] = str.split(',').map(Number)
    return { x, y }
  }
  const toSegment = (str: string) => {
    const [start, end] = str.split(' -> ').map(toPoint)
    return { start, end }
  }
  return lines.map(toSegment)
}

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

const toLinePoints = (segment: LineSegment): Point[] => {
  const points: Point[] = []
  const minX = Math.min(segment.start.x, segment.end.x)
  const maxX = Math.max(segment.start.x, segment.end.x)
  const minY = Math.min(segment.start.y, segment.end.y)
  const maxY = Math.max(segment.start.y, segment.end.y)
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      points.push({ x, y })
    }
  }
  return points
}

type Overlaps = Record<number, Record<number, number> | undefined>

const countOverlaps = (overlaps: Overlaps) =>
  Object.values(overlaps).reduce((acc, row) => {
    if (!row) {
      return acc
    }

    return acc + Object.values(row).filter((n) => n >= 2).length
  }, 0)

describe('Day 5: Hydrothermal Venture', () => {
  describe('Part 1', () => {
    function solution(lineSegments: Input): number {
      const overlaps: Overlaps = {}
      const horizontalLines = lineSegments.filter(
        ({ start, end }) => start.y === end.y
      )
      const verticalLines = lineSegments.filter(
        ({ start, end }) => start.x === end.x
      )

      for (const line of horizontalLines.concat(verticalLines)) {
        for (const point of toLinePoints(line)) {
          let row = overlaps[point.y]
          if (!row) {
            row = overlaps[point.y] = {}
          }

          if (!row[point.x]) {
            row[point.x] = 0
          }

          row[point.x]++
        }
      }

      return countOverlaps(overlaps)
    }

    test('with example data', () => {
      const testData = load('test-1')
      expect(solution(testData)).toBe(5)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(6189)
    })
  })

  xdescribe('Part 2', () => {
    function solution(lineSegments: Input): number {
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
