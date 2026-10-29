import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCatalogItem } from '@/api/catalogs'
import { CATALOGS } from '@/features/catalogs/constants'
import { useToast } from '@/lib/toastContext'

export function useDeleteCatalogItem(resource) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { singular } = CATALOGS.find((catalog) => catalog.id === resource)

  return useMutation({
    mutationFn: (id) => deleteCatalogItem(resource, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog', resource] })
      showToast(`${singular[0].toUpperCase()}${singular.slice(1)} deleted`)
    },
  })
}
