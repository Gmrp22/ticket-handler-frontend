import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getTickets } from '@/features/tickets/api'

export function useTickets({ page, sort, order }) {
  return useQuery({
    queryKey: ['tickets', { page, sort, order }],
    queryFn: () => getTickets({ page, sort, order }),
    placeholderData: keepPreviousData,
  })
}
