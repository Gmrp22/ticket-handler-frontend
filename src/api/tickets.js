import { request } from './client'

export function getTickets(page = 1, limit = 20) {
  return request(`/tickets?page=${page}&limit=${limit}`)
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
