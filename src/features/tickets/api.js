import { request } from '@/lib/apiClient'

// sort: 'date' | 'code' | 'id', order: 'asc' | 'desc'
export function getTickets({ page = 1, limit = 20, sort = 'date', order = 'desc' } = {}) {
  const params = new URLSearchParams({ page, limit, sort, order })
  return request(`/tickets?${params}`)
}

export function getTicket(id) {
  return request(`/tickets/${id}`)
}

export function createTicket(ticket) {
  return request('/tickets', { method: 'POST', body: ticket })
}

// Replaces the ticket and all its items
export function updateTicket(id, ticket) {
  return request(`/tickets/${id}`, { method: 'PUT', body: ticket })
}

export function deleteTicket(id) {
  return request(`/tickets/${id}`, { method: 'DELETE' })
}
