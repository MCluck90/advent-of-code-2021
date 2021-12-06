import * as fs from 'fs'
import * as path from 'path'
import { default as axios } from 'axios'
import { default as cheerio } from 'cheerio'
import { default as chalk } from 'chalk'
import { default as TurndownService } from 'turndown'

const getDayUrl = (day: number) => `https://adventofcode.com/2021/day/${day}`
const isOk = (status: number) => status >= 200 && status < 300

interface Challenge {
  title: string
  description: string
  testInput: string
  link: string
}

async function main() {
  const dayArg = process.argv[2]
  let day = 0
  if (dayArg === 'today') {
    day = new Date().getDate()
  } else if (dayArg === 'yesterday') {
    day = new Date().getDate() - 1
  } else if (!dayArg) {
    console.log('Provide an argument: today, yesterday, or a date')
    return
  } else if (Number.isNaN(Number(dayArg))) {
    console.log(`Invalid day argument: ${dayArg}`)
    return
  } else {
    day = Number(dayArg)
  }

  const { title, description, testInput, link } = await getChallenge(day)
  console.log(chalk.green.bold(title))
  console.log(chalk.blue.underline(link))
  generateTestFile(day, title, description, testInput)

  console.log('Test files have been created.')
  console.log('Next steps:')
  console.log('- Verify test data')
  console.log('- Add puzzle input')
  console.log('- Assign expected answers to test cases')
}
main()

async function getChallenge(day: number): Promise<Challenge> {
  const link = getDayUrl(day)
  const response = await axios.get(link)
  if (!isOk(response.status)) {
    throw response.data
  }

  const $ = cheerio.load(response.data)
  const $description = $('article.day-desc')
  const title = $description.children('h2').text().replace(/---/g, '').trim()
  const testInput = $('pre').first().text().trim()

  const turndownService = new TurndownService({
    emDelimiter: '**' as '*',
  })
  turndownService.addRule('em', {
    filter(node, options) {
      return node.nodeName === 'EM' && node.parentNode?.nodeName === 'CODE'
    },
    replacement(content, node, options) {
      return content
    },
  })
  return {
    title,
    description: turndownService.turndown(
      $description.html()?.toString() || ''
    ),
    testInput,
    link,
  }
}

function generateTestFile(
  day: number,
  title: string,
  description: string,
  testInput: string
) {
  const source = `
import * as path from 'path'
import { readFileSync } from 'fs'

type Input = unknown

const parse = (input: string): Input => null

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

describe('${title}', () => {
  describe('Part 1', () => {
    function solution(input: Input): number {
      return -1
    }

    test('with example data', () => {
      const testData = load('test-1')
      expect(solution(testData)).toBe(0)
    })

    test('with puzzle input', () => {
      const testData = load('puzzle')
      expect(solution(testData)).toBe(0)
    })
  })

  describe('Part 2', () => {
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
`.trim()
  const dayName = `day-${leftPad(day)}`
  const testsFolder = path.join(__dirname, '../tests')
  const dayFolder = path.join(testsFolder, dayName)
  const p = (f: string) => path.join(dayFolder, f)
  const readme = p('README.md')
  const testFile = p(`${dayName}.test.ts`)
  const puzzleInput = p('puzzle-input.txt')
  const testData1 = p('test-data.part-1.txt')
  const testData2 = p('test-data.part-2.txt')
  if (!fs.existsSync(dayFolder)) {
    fs.mkdirSync(dayFolder)
  }
  fs.writeFileSync(readme, description)
  fs.writeFileSync(testFile, source)
  fs.writeFileSync(puzzleInput, '')
  fs.writeFileSync(testData1, testInput)
  fs.writeFileSync(testData2, testInput)
}

function leftPad(n: number) {
  return n < 10 ? `0${n}` : n.toString()
}
