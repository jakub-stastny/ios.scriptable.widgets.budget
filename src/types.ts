export type WeekIndex = number //1 | 2 | 3 | 4 | 5 | 6 | 7
export type SpendingCurve = Array<number>
// export type SpendingCurve = Array<[number, number, number, number, number, number, number]>
export type PartialSpendingCurve = Array<number>

export interface Config {
  weekStartIndex: number,
  totalBudget: number,
  // getSpendingCurve(n: number): Array<Array<number>>
  // projectedSpendingCurve: Array<[string, string, string, string, string, string, string]>
  projectedSpendingCurve: Array<string>
}

// Copy from Config, but mark everything as optional.
// For testing.
export interface PartialConfig {
  weekStartIndex?: number,
  totalBudget?: number,
  projectedSpendingCurve?: Array<string>
}


// This is how you do it!
// Is there any online yet? (scriptable.d.ts)
// declare class ListWidget {
//   url: string
//   addText(text: string)
// }
