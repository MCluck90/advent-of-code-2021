import * as path from 'path'
import { readFileSync } from 'fs'

type Character = '(' | '[' | '{' | '<' | '>' | '}' | ']' | ')'
type Input = string[][]

const parse = (input: string): Input =>
  input.split('\n').map((line) => line.split(''))

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

describe('Day 10: Syntax Scoring', () => {
  describe('Part 1', () => {
    function solution(input: Input): number {
      const errorScores: Record<string, number> = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137,
      }

      const pairs: Record<string, string> = {
        '(': ')',
        '[': ']',
        '{': '}',
        '<': '>',
      }

      function scoreLine(line: string[]): number {
        const stack: string[] = []
        let score = 0
        for (const char of line) {
          if ('([{<'.includes(char)) {
            stack.push(char)
          } else {
            const top = stack.pop() || ''
            if (top === undefined || pairs[top] !== char) {
              score += errorScores[char]
            }
          }
        }
        return score
      }

      return input.reduce((acc, line) => acc + scoreLine(line), 0)
    }

    test('with example data', () => {
      const testData = load('test-1')
      expect(solution(testData)).toBe(26397)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(388713)
    })
  })

  describe('Part 2', () => {
    function solution(input: Input): number {
      const correctionScores: Record<string, number> = {
        '(': 1,
        '[': 2,
        '{': 3,
        '<': 4,
      }

      const pairs: Record<string, string> = {
        '(': ')',
        '[': ']',
        '{': '}',
        '<': '>',
      }

      function scoreLine(line: string[]): number {
        const stack: string[] = []
        for (const char of line) {
          if ('([{<'.includes(char)) {
            stack.push(char)
          } else {
            const top = stack.pop() || ''
            if (top === undefined || pairs[top] !== char) {
              return -1
            }
          }
        }

        return stack
          .reverse()
          .reduce((acc, char) => acc * 5 + correctionScores[char], 0)
      }

      const scores = input
        .map(scoreLine)
        .filter((score) => score !== -1)
        .sort((a, b) => (a < b ? 1 : -1))
      return scores[Math.floor(scores.length / 2)]
    }

    test('with example data', () => {
      const testData = load('test-2')
      expect(solution(testData)).toBe(288957)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(3539961434)
    })
  })
})
