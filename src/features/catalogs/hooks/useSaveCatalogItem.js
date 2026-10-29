import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCatalogItem, updateCatalogItem } from '@/features/catalogs/api'

// Creates an item, or updates it when an id is given
export function useSaveCatalogItem(resource, id) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (item) =>
      id ? updateCatalogItem(resource, id, item) : createCatalogItem(resource, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog', resource] })
      // Tickets and payments show the name of the supplier, land and product
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['ticket'] })
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}
