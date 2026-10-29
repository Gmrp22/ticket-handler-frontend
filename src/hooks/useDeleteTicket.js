import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTicket } from '../api/tickets'

export function useDeleteTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTicket,
    // The cached lists are outdated now, so they are requested again
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  })
}
