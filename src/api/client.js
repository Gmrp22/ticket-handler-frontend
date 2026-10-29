import logger from '../utils/logger'

const BASE_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  constructor(status, error) {
    // The API sends `error` as a text or a list of texts
    super(Array.isArray(error) ? error.join(', ') : error)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function request(path, { method = 'GET', body } = {}) {
  logger.debug({ method, path }, 'api request')

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    logger.error({ method, path, err }, 'network error')
    throw new ApiError(0, 'Could not reach the server')
  }

  // DELETE answers 204 with no body
  if (response.status === 204) return null

  const data = await response.json()

  if (!response.ok) {
    logger.warn({ method, path, status: response.status, error: data.error }, 'api error')
    throw new ApiError(response.status, data.error)
  }

  return data
}
