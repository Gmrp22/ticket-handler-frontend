import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate, formatNumber } from '@/lib/format'

describe('formatNumber', () => {
  it('converts the text sent by the API', () => {
    expect(formatNumber('1475.000')).toBe('1,475.00')
  })

  it('keeps up to 3 decimals', () => {
    expect(formatNumber('1.023')).toBe('1.023')
  })

  it('shows at least 2 decimals', () => {
    expect(formatNumber('0.7')).toBe('0.70')
  })
})

describe('formatCurrency', () => {
  it('shows dollars with thousands separator', () => {
    expect(formatCurrency('6845.000')).toBe('$6,845.00')
  })

  it('accepts numbers too', () => {
    expect(formatCurrency(0.7)).toBe('$0.70')
  })

  it('shows zero', () => {
    expect(formatCurrency('0.000')).toBe('$0.00')
  })
})

describe('formatDate', () => {
  it('turns YYYY-MM-DD into dd/MM/yyyy', () => {
    expect(formatDate('2023-01-07')).toBe('07/01/2023')
  })

  it('does not move the day because of the time zone', () => {
    expect(formatDate('2023-12-31')).toBe('31/12/2023')
  })
})
