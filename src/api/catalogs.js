import { request } from './client'

// resource: 'suppliers' | 'lands' | 'products' (same shape and endpoints)
export function getCatalog(resource) {
  return request(`/${resource}`)
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
