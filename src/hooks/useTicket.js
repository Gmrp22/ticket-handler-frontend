import { useQuery } from '@tanstack/react-query'
import { getTicket } from '../api/tickets'

// With no id (creating a ticket) nothing is requested
export function useTicket(id) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicket(id),
    enabled: id != null,
  })
}
