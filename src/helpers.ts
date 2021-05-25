import { WeekIndex, SpendingCurve, PartialSpendingCurve, Config } from './types'
import { Equation, parse as parseExpression } from 'algebra.js'

export function getDaysRunning(today: Date = new Date(), weekStartIndex: WeekIndex = 1) : number {
  if (today.getDay() < weekStartIndex) {
    return today.getDay() + weekStartIndex
  } else {
    return today.getDay() - weekStartIndex + 1
  }
}

export function getFirstDayOfTheWeek(today: Date = new Date(), weekStartIndex: WeekIndex) : Date {
  let date = new Date(today)

  while (date.getDay() != weekStartIndex) {
    date.setDate(date.getDate() - 1)
  }

  return date
}

export function calculateSpendingCurve(config: Config) : SpendingCurve {
  const days = config.projectedSpendingCurve.map(expr => parseExpression(expr))
  const week = days.reduce((a, b) => a.add(b))
  const eq = new Equation(week, config.totalBudget)
  const n = Math.round(eq.solveFor('n').valueOf())

  const spendingCurve =  days.map(expr => (
    Math.round(expr.eval({n}).constant().valueOf()))
  )

  spendingCurve[spendingCurve.length - 1] = (
    spendingCurve[spendingCurve.length - 1] - (
      spendingCurve.reduce((a, b) => a + b) - config.totalBudget
    )
  )

  return spendingCurve
}

export function calculateUpdatedSpendingCurve(config: Config, spentAlready: number, daysRunning: WeekIndex) : PartialSpendingCurve {
  if (daysRunning == 7 ) return []

  const projectedSpendingCurve = config.projectedSpendingCurve.slice(daysRunning, 7)

  const updatedConfig = {
    totalBudget: config.totalBudget - spentAlready,
    projectedSpendingCurve
  }

  return calculateSpendingCurve(Object.assign({}, config, updatedConfig))
}

// https://colordesigner.io/gradient-generator
const gradient = [
  '#2aa722', '#66ad1a', '#89b016', // green
  '#afb412', '#b5a710', '#b7950e', // yellow
  '#b8820c', '#ba6e0a', '#bb5a08', '#bd4406', // orange
  '#be2e04', '#c01802', '#c10000' // red
]

/*
 * Less (greenest green)
 * Opt daily budget: (1400 - 300) / 7 = 160
 * Max daily budget: 1400 / 7 = 200 per day
 * More (redest red)
 */

export function getColour (spentAlready: number, availableTillNowTotal: number) : string {
  if (spentAlready > availableTillNowTotal) {
    return gradient[gradient.length - 1]
  } else if (spentAlready < availableTillNowTotal) {
    return gradient[0]
  } else {
    // TODO
    return gradient[7]
  }
}
