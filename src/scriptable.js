export async function getSpendingEntries(firstDayOfTheWeek, today, calendarTitle) {
  const calendar = await Calendar.forEventsByTitle(calendarTitle)
  return await CalendarEvent.between(firstDayOfTheWeek, today, [calendar])
}
