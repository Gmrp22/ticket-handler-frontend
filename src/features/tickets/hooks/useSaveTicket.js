import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTicket, updateTicket } from '@/features/tickets/api'

// Creates a ticket, or updates it when an id is given
export function useSaveTicket(ticketId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ticket) =>
      ticketId ? updateTicket(ticketId, ticket) : createTicket(ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['ticket'] })
    },
  })
}
