// This works:
// const widget = new ListWidget()
// widget.addText("Time frame")
// Script.setWidget(widget)
// Script.complete()

import configData from './config.ts'
import * as helpers from './helpers.ts'
import * as scriptable from './scriptable.js'
import { Config } from './types.ts'
import { Widget } from './widget.ts'

// We wrap it all in an async function just so the compilation doesn't fail for using top-level await.
async function main() {
  const config: Config = configData

  const today = new Date()
  const firstDayOfTheWeek = helpers.getFirstDayOfTheWeek(today, config.weekStartIndex)
  const daysRunning = helpers.getDaysRunning(today, config.weekStartIndex)

  const entries = await scriptable.getSpendingEntries(firstDayOfTheWeek, today, "Spending log")
  // TODO: Either figure out how to access my Working Copy data and get the current_week item OR make the interface generic (SpendingEntryFromText, SpendingEntryFromCalendar).
  const spentAlready = entries.map(entry => parseInt(entry.notes)).reduce((sum, i) => sum + i, 0)

  const spendingCurve = helpers.calculateSpendingCurve(config)
  const spendingCurveUptoNow = spendingCurve.slice(0, daysRunning)

  const availableTillNowTotal = spendingCurveUptoNow.reduce((sum, i) => sum + i)
  const availableForToday = availableTillNowTotal - spentAlready

  const projectedN = Math.min(...spendingCurve)
  const updatedSpendingCurve = helpers.calculateUpdatedSpendingCurve(config, spentAlready, daysRunning)
  const updatedN = Math.min(...updatedSpendingCurve)

  const alertColour = helpers.getColour(spentAlready, availableTillNowTotal)
  const lastEntry = entries[entries.length - 1]

  // The widget
  new Widget('shortcuts://run-shortcut?name=Update%20spendings', (widget) => {
  //   widget.setBackgroundImage('piggie.jpg')

    const spentAlreadyText = widget.line(`$${spentAlready} out of ${availableTillNowTotal}`, new Color(alertColour, 90))

    const spentToday = lastEntry && lastEntry.startDate.getDate() == today.getDate() ? parseInt(lastEntry.notes) : 0
  widget.line(`Spent today: $${spentToday}`)

    widget.line(availableForToday > 0 ? `Available: $${availableForToday}`: `Current deficit: ${Math.abs(availableForToday)}`, new Color('#cfbfc4', 90))

    widget.line(`n: $${updatedN} ($${projectedN})`, new Color('#cfbfc4', 90))
  })
}

main()
