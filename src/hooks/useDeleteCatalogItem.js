import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCatalogItem } from '../api/catalogs'

export function useDeleteCatalogItem(resource) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => deleteCatalogItem(resource, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalog', resource] }),
  })
}
