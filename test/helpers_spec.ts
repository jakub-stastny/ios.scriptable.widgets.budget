import { expect } from 'chai'
import { Config, SpendingCurve } from '../src/types'
import * as helpers from '../src/helpers'

const days = [
  {date: new Date(2021, 4 - 1, 15), day: 'Thursday'},
  {date: new Date(2021, 4 - 1, 16), day: 'Friday'},
  {date: new Date(2021, 4 - 1, 17), day: 'Saturday'},
  {date: new Date(2021, 4 - 1, 18), day: 'Sunday'},
  {date: new Date(2021, 4 - 1, 19), day: 'Monday'},
  {date: new Date(2021, 4 - 1, 20), day: 'Tuesday'},
  {date: new Date(2021, 4 - 1, 21), day: 'Wednesday'},
]

const Thursday = days[0].date

const weekStartIndex = 4

function formatDate(date: Date) {
  return date.toLocaleString('en-GB')
}

describe('getDaysRunning()', () => {
  context("finance week starts on Thursday", () => {
    const tests = days.map((day, index) => Object.assign(day, {expected: index + 1}))

    tests.forEach(test => {
      it(`returns ${test.expected} for ${test.day}`, () => {
        expect(helpers.getDaysRunning(test.date, weekStartIndex)).to.equal(test.expected)
      })
    })
  })
})

describe('getFirstDayOfTheWeek()', () => {
  context("finance week starts on Thursday", () => {
    days.forEach(day => {
      it("returns Thursday", () => {
        const firstDay = helpers.getFirstDayOfTheWeek(day.date, weekStartIndex)
        expect(formatDate(firstDay)).to.equal(formatDate(Thursday))
      })
    })
  })
})

const config: Config = {
  weekStartIndex: 4,
  totalBudget: 1000,
  projectedSpendingCurve: [
    '300 + (2/3 * n)', 'n', 'n', 'n', '150 + n', 'n', 'n + 40'
  ]
}

describe('calculateSpendingCurve()', () => {
  it("returns the spending curve", () => {
    const spendingCurve = helpers.calculateSpendingCurve(config)

    expect(spendingCurve.length).to.equal(7)
    expect(spendingCurve.reduce((sum, i) => sum + i, 0)).to.equal(config.totalBudget)
  })
})

describe('calculateUpdatedSpendingCurve()', () => {
  const tests = [
    Object.assign({daysRunning: 1, spentAlready: 325}, days[0]),
    Object.assign({daysRunning: 2, spentAlready: 432}, days[1]),
    Object.assign({daysRunning: 3, spentAlready: 537}, days[2]),
    Object.assign({daysRunning: 4, spentAlready: 537}, days[3]),
    Object.assign({daysRunning: 5, spentAlready: 718}, days[4]),
    Object.assign({daysRunning: 6, spentAlready: 819}, days[5])
  ]

  tests.forEach(({ daysRunning, spentAlready, day }) => {
    it(`returns the spending curve for the remaining ${7 - daysRunning} days`, () => {
      const spendingCurve = helpers.calculateUpdatedSpendingCurve(config, spentAlready, daysRunning)

      expect(spendingCurve.length).to.equal(7 - daysRunning)
      expect(spendingCurve.reduce((sum, i) => sum + i)).to.equal(config.totalBudget - spentAlready)
    })
  })

  it("returns an empty array for the last day of the week", () => {
      const result = helpers.calculateUpdatedSpendingCurve(config, 990, 7)

      expect(result.length).to.equal(0)
  })
})
