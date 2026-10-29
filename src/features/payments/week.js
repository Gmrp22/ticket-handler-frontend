import {
  addWeeks,
  endOfISOWeek,
  format,
  getISOWeek,
  getISOWeekYear,
  setISOWeek,
  startOfISOWeek,
} from 'date-fns'

// Same limits as the API
export const isValidYear = (year) => Number.isInteger(year) && year >= 1900 && year <= 2100
export const isValidWeekNumber = (week) => Number.isInteger(week) && week >= 1 && week <= 53
export const isValidWeek = (year, week) => isValidYear(year) && isValidWeekNumber(week)

export function getCurrentWeek() {
  const now = new Date()
  return { year: getISOWeekYear(now), week: getISOWeek(now) }
}

// January 4th is always in week 1 of its ISO year
const dateInWeek = (year, week) => setISOWeek(new Date(year, 0, 4), week)

// amount: 1 for the next week, -1 for the previous one (handles the change of year)
export function shiftWeek(year, week, amount) {
  const target = addWeeks(dateInWeek(year, week), amount)
  return { year: getISOWeekYear(target), week: getISOWeek(target) }
}

// Monday to Sunday of the week, e.g. "16/01/2023 - 22/01/2023"
export function formatWeekRange(year, week) {
  const date = dateInWeek(year, week)
  return `${format(startOfISOWeek(date), 'dd/MM/yyyy')} - ${format(endOfISOWeek(date), 'dd/MM/yyyy')}`
}
