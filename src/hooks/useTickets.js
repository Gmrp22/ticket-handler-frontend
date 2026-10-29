import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getTickets } from '../api/tickets'

export function useTickets({ page, sort, order }) {
  return useQuery({
    queryKey: ['tickets', { page, sort, order }],
    queryFn: () => getTickets({ page, sort, order }),
    placeholderData: keepPreviousData,
  })
}
