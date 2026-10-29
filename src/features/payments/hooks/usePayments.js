import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getWeeklyPayments } from '@/features/payments/api'
import { isValidWeek } from '@/features/payments/week'

export function usePayments(year, week) {
  return useQuery({
    queryKey: ['payments', year, week],
    queryFn: () => getWeeklyPayments(year, week),
    // The API answers 400 for an invalid year or week, so it is not requested
    enabled: isValidWeek(year, week),
    placeholderData: keepPreviousData,
  })
}
