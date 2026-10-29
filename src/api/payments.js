import { request } from './client'

// year: ISO year, week: ISO week (1 to 53)
export function getWeeklyPayments(year, week) {
  return request(`/payments?year=${year}&week=${week}`)
}
