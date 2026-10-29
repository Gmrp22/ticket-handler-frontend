import { useQuery } from '@tanstack/react-query'
import { getTicket } from '../api/tickets'

export function useTicket(id) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicket(id),
  })
}
