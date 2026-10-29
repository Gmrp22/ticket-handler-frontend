import { request } from './client'

export function getTickets(page = 1, limit = 20) {
  return request(`/tickets?page=${page}&limit=${limit}`)
}
