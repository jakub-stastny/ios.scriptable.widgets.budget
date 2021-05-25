const cheAllowance = 300
const marketAllowance = 150
const beerAllowance = 40

export default {
  // My financial week starts on Thursday.
  weekStartIndex: 4,

  totalBudget: 1200 - 200,

  projectedSpendingCurve: [
    `${cheAllowance} + (2/3 * n)`, 'n', 'n', 'n', `${marketAllowance} + n`, 'n', `n + ${beerAllowance}`
  ]
  // shortcutsURL: 'shortcuts://run-shortcut?name=Update%20spendings'
  // backgroundImage: 'piggie.jpg'
}
