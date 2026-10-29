import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getCatalog } from '@/api/catalogs'

// With no sort the list comes by name, which is also the order of the selects of the forms
export function useCatalog(resource, { sort = 'name', order = 'asc' } = {}) {
  return useQuery({
    queryKey: ['catalog', resource, { sort, order }],
    queryFn: () => getCatalog(resource, { sort, order }),
    placeholderData: keepPreviousData,
    // Catalogs rarely change, so the cached list is reused for a while
    staleTime: 5 * 60 * 1000,
  })
}
