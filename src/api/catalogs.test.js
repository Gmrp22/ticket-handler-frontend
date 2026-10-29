import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCatalogItem, deleteCatalogItem, getCatalog, updateCatalogItem } from './catalogs'
import { request } from './client'

vi.mock('./client')

describe('catalogs api', () => {
  beforeEach(() => {
    vi.mocked(request).mockResolvedValue({})
  })

  it('asks for the list by name, ascending, by default', async () => {
    await getCatalog('suppliers')
    expect(request).toHaveBeenCalledWith('/suppliers?sort=name&order=asc')
  })

  it('sends the sort that is given', async () => {
    await getCatalog('lands', { sort: 'code', order: 'desc' })
    expect(request).toHaveBeenCalledWith('/lands?sort=code&order=desc')
  })

  it('works for the three resources', async () => {
    await getCatalog('products')
    expect(request).toHaveBeenCalledWith('/products?sort=name&order=asc')
  })

  it('creates with POST', async () => {
    const item = { code: 'SUP1', name: 'Name' }
    await createCatalogItem('suppliers', item)
    expect(request).toHaveBeenCalledWith('/suppliers', { method: 'POST', body: item })
  })

  it('updates with PUT', async () => {
    const item = { code: 'SUP1', name: 'Name' }
    await updateCatalogItem('suppliers', 4, item)
    expect(request).toHaveBeenCalledWith('/suppliers/4', { method: 'PUT', body: item })
  })

  it('deletes with DELETE', async () => {
    await deleteCatalogItem('products', 4)
    expect(request).toHaveBeenCalledWith('/products/4', { method: 'DELETE' })
  })
})
