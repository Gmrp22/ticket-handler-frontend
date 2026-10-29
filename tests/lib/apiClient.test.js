import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, request } from '@/lib/apiClient'

const respond = (status, body) => ({
  status,
  ok: status >= 200 && status < 300,
  json: vi.fn().mockResolvedValue(body),
})

// Runs the request and returns the error it throws
const failure = async (promise) => {
  try {
    await promise
  } catch (error) {
    return error
  }
  throw new Error('The request did not fail')
}

describe('request', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the JSON of the response', async () => {
    fetch.mockResolvedValue(respond(200, { id: 1 }))

    await expect(request('/tickets/1')).resolves.toEqual({ id: 1 })
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/tickets/1'), expect.objectContaining({ method: 'GET' }))
  })

  it('sends the body as JSON with its header', async () => {
    fetch.mockResolvedValue(respond(201, { id: 5 }))

    await request('/suppliers', { method: 'POST', body: { code: 'SUP1', name: 'Name' } })

    const [, options] = fetch.mock.calls[0]
    expect(options.method).toBe('POST')
    expect(options.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(options.body).toBe(JSON.stringify({ code: 'SUP1', name: 'Name' }))
  })

  it('does not send header or body without a body', async () => {
    fetch.mockResolvedValue(respond(200, []))

    await request('/suppliers')

    const [, options] = fetch.mock.calls[0]
    expect(options.headers).toBeUndefined()
    expect(options.body).toBeUndefined()
  })

  it('returns null on a 204 and does not read the body', async () => {
    const response = respond(204)
    fetch.mockResolvedValue(response)

    await expect(request('/tickets/1', { method: 'DELETE' })).resolves.toBeNull()
    expect(response.json).not.toHaveBeenCalled()
  })

  it('throws an ApiError with the status and message of the API', async () => {
    fetch.mockResolvedValue(respond(404, { status: 404, error: 'Supplier not found' }))

    const error = await failure(request('/suppliers/99'))

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(404)
    expect(error.message).toBe('Supplier not found')
  })

  it('joins a list of messages in one text', async () => {
    fetch.mockResolvedValue(
      respond(400, { status: 400, error: ['code: Too small', 'items.0.price: Invalid input'] }),
    )

    const error = await failure(request('/tickets', { method: 'POST', body: {} }))

    expect(error.status).toBe(400)
    expect(error.message).toBe('code: Too small, items.0.price: Invalid input')
  })

  it('throws an ApiError with status 0 when the server does not answer', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'))

    const error = await failure(request('/tickets'))

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(0)
    expect(error.message).toBe('Could not reach the server')
  })

  it('throws an ApiError when the answer is not JSON', async () => {
    fetch.mockResolvedValue({
      status: 502,
      ok: false,
      json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected token <')),
    })

    const error = await failure(request('/tickets'))

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(502)
    expect(error.message).toBe('Unexpected response from the server')
  })
})
