import { describe, expect, it } from 'vitest'
import { catalogSchema } from './catalogSchema'

const errorsOf = (input) => {
  const result = catalogSchema.safeParse(input)
  return result.success ? [] : result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
}

describe('catalogSchema', () => {
  it('accepts a valid item and trims the spaces', () => {
    expect(catalogSchema.parse({ code: ' SUP999 ', name: ' Name ' })).toEqual({
      code: 'SUP999',
      name: 'Name',
    })
  })

  it('asks for code and name', () => {
    expect(errorsOf({ code: '', name: '   ' })).toEqual([
      'code: Code is required',
      'name: Name is required',
    ])
  })

  it('accepts 255 characters and rejects 256, like the API', () => {
    expect(errorsOf({ code: 'a'.repeat(255), name: 'ok' })).toEqual([])
    expect(errorsOf({ code: 'a'.repeat(256), name: 'ok' })).toEqual(['code: Up to 255 characters'])
  })
})
