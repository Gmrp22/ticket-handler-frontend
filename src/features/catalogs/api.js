import { request } from '@/lib/apiClient'

// resource: 'suppliers' | 'lands' | 'products' (same shape and endpoints)
// sort: 'id' | 'code' | 'name', order: 'asc' | 'desc'. By name, because it is the easiest to read.
export function getCatalog(resource, { sort = 'name', order = 'asc' } = {}) {
  const params = new URLSearchParams({ sort, order })
  return request(`/${resource}?${params}`)
}

// item: { code, name }
export function createCatalogItem(resource, item) {
  return request(`/${resource}`, { method: 'POST', body: item })
}

export function updateCatalogItem(resource, id, item) {
  return request(`/${resource}/${id}`, { method: 'PUT', body: item })
}

export function deleteCatalogItem(resource, id) {
  return request(`/${resource}/${id}`, { method: 'DELETE' })
}
