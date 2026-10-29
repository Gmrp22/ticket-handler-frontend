import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTicket } from '@/features/tickets/api'
import { useToast } from '@/lib/toastContext'

export function useDeleteTicket() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      // The cached lists are outdated now, so they are requested again
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      showToast('Ticket deleted')
    },
  })
}
