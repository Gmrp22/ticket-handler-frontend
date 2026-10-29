import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCatalogItem } from '@/features/catalogs/api'

export function useDeleteCatalogItem(resource) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => deleteCatalogItem(resource, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalog', resource] }),
  })
}
