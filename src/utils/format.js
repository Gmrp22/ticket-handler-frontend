import { format, parseISO } from 'date-fns'

// The API sends decimals as strings (e.g. "1475.000")
export function formatNumber(value) {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  })
}

export function formatCurrency(value) {
  return Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

// The API sends dates as YYYY-MM-DD
export function formatDate(value) {
  return format(parseISO(value), 'dd/MM/yyyy')
}
