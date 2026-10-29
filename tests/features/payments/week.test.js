import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  formatWeekRange,
  getCurrentWeek,
  isValidWeek,
  isValidWeekNumber,
  isValidYear,
  shiftWeek,
} from '@/features/payments/week'

describe('validation', () => {
  it('accepts the same limits as the API', () => {
    expect(isValidYear(1900)).toBe(true)
    expect(isValidYear(2100)).toBe(true)
    expect(isValidWeekNumber(1)).toBe(true)
    expect(isValidWeekNumber(53)).toBe(true)
    expect(isValidWeek(2023, 3)).toBe(true)
  })

  it('rejects values out of range', () => {
    expect(isValidYear(1899)).toBe(false)
    expect(isValidYear(2101)).toBe(false)
    expect(isValidWeekNumber(0)).toBe(false)
    expect(isValidWeekNumber(54)).toBe(false)
  })

  it('rejects empty and decimal values', () => {
    expect(isValidWeek('', 3)).toBe(false)
    expect(isValidWeek(2023, '')).toBe(false)
    expect(isValidWeek(2023, 3.5)).toBe(false)
    expect(isValidWeek(NaN, 3)).toBe(false)
  })
})

describe('shiftWeek', () => {
  it('moves inside the same year', () => {
    expect(shiftWeek(2023, 3, 1)).toEqual({ year: 2023, week: 4 })
    expect(shiftWeek(2023, 3, -1)).toEqual({ year: 2023, week: 2 })
  })

  it('goes back to the previous year', () => {
    expect(shiftWeek(2023, 1, -1)).toEqual({ year: 2022, week: 52 })
    expect(shiftWeek(2025, 1, -1)).toEqual({ year: 2024, week: 52 })
  })

  it('goes forward to the next year', () => {
    expect(shiftWeek(2024, 52, 1)).toEqual({ year: 2025, week: 1 })
  })

  it('handles the years with 53 weeks', () => {
    expect(shiftWeek(2020, 53, 1)).toEqual({ year: 2021, week: 1 })
    expect(shiftWeek(2021, 1, -1)).toEqual({ year: 2020, week: 53 })
  })
})

describe('formatWeekRange', () => {
  it('shows Monday to Sunday', () => {
    expect(formatWeekRange(2023, 3)).toBe('16/01/2023 - 22/01/2023')
  })

  it('crosses the change of year', () => {
    expect(formatWeekRange(2025, 1)).toBe('30/12/2024 - 05/01/2025')
  })
})

describe('getCurrentWeek', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('uses the ISO year, which can differ from the year of the date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 11, 30, 12))
    expect(getCurrentWeek()).toEqual({ year: 2025, week: 1 })
  })
})
