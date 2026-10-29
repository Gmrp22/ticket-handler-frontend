import { beforeEach, describe, expect, it, vi } from 'vitest'
import { request } from '@/lib/apiClient'
import { createTicket, deleteTicket, getTicket, getTickets, updateTicket } from '@/features/tickets/api'

vi.mock('@/lib/apiClient')

describe('tickets api', () => {
  beforeEach(() => {
    vi.mocked(request).mockResolvedValue({})
  })

  it('asks for the first page, newest first, by default', async () => {
    await getTickets()
    expect(request).toHaveBeenCalledWith('/tickets?page=1&limit=20&sort=date&order=desc')
  })

  it('sends the page and the sort', async () => {
    await getTickets({ page: 3, sort: 'code', order: 'asc' })
    expect(request).toHaveBeenCalledWith('/tickets?page=3&limit=20&sort=code&order=asc')
  })

  it('asks for one ticket', async () => {
    await getTicket(7)
    expect(request).toHaveBeenCalledWith('/tickets/7')
  })

  it('creates with POST', async () => {
    const ticket = { code: '1' }
    await createTicket(ticket)
    expect(request).toHaveBeenCalledWith('/tickets', { method: 'POST', body: ticket })
  })

  it('updates with PUT', async () => {
    const ticket = { code: '1' }
    await updateTicket(7, ticket)
    expect(request).toHaveBeenCalledWith('/tickets/7', { method: 'PUT', body: ticket })
  })

  it('deletes with DELETE', async () => {
    await deleteTicket(7)
    expect(request).toHaveBeenCalledWith('/tickets/7', { method: 'DELETE' })
  })
})
