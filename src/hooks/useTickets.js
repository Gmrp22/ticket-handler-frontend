import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getTickets } from '../api/tickets'

export function useTickets(page) {
  return useQuery({
    queryKey: ['tickets', page],
    queryFn: () => getTickets(page),
    placeholderData: keepPreviousData,
  })
}
