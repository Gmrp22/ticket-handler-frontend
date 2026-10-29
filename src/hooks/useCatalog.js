import { useQuery } from '@tanstack/react-query'
import { getCatalog } from '../api/catalogs'

export function useCatalog(resource) {
  return useQuery({
    queryKey: ['catalog', resource],
    queryFn: () => getCatalog(resource),
    // Catalogs rarely change, so the cached list is reused for a while
    staleTime: 5 * 60 * 1000,
  })
}
