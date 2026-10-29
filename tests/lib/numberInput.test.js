import { describe, expect, it, vi } from 'vitest'
import { blockInvalidKeys } from '@/lib/numberInput'

const press = (key) => {
  const event = { key, preventDefault: vi.fn() }
  blockInvalidKeys(event)
  return event.preventDefault
}

describe('blockInvalidKeys', () => {
  it.each(['-', '+', 'e', 'E'])('blocks "%s"', (key) => {
    expect(press(key)).toHaveBeenCalled()
  })

  it.each(['0', '5', '.', 'Backspace', 'Tab', 'ArrowLeft'])('lets "%s" pass', (key) => {
    expect(press(key)).not.toHaveBeenCalled()
  })
})
