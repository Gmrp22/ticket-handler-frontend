import { request } from './client'

// resource: 'suppliers' | 'lands' | 'products' (same shape and endpoints)
export function getCatalog(resource) {
  return request(`/${resource}`)
}
