import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ToastProvider from '@/components/ui/ToastProvider'
import { useToast } from '@/lib/toastContext'

function Buttons() {
  const { showToast } = useToast()
  return (
    <>
      <button onClick={() => showToast('Ticket created')}>Success</button>
      <button onClick={() => showToast('Something failed', 'error')}>Failure</button>
    </>
  )
}

const renderToasts = () =>
  render(
    <ToastProvider>
      <Buttons />
    </ToastProvider>,
  )

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the message in a region that screen readers announce', () => {
    renderToasts()

    fireEvent.click(screen.getByRole('button', { name: 'Success' }))

    expect(screen.getByRole('status')).toHaveTextContent('Ticket created')
  })

  it('shows several messages at the same time', () => {
    renderToasts()

    fireEvent.click(screen.getByRole('button', { name: 'Success' }))
    fireEvent.click(screen.getByRole('button', { name: 'Failure' }))

    expect(screen.getByText('Ticket created')).toBeInTheDocument()
    expect(screen.getByText('Something failed')).toBeInTheDocument()
  })

  it('removes the message after a few seconds', () => {
    renderToasts()
    fireEvent.click(screen.getByRole('button', { name: 'Success' }))

    act(() => {
      vi.advanceTimersByTime(4900)
    })
    expect(screen.getByText('Ticket created')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(screen.queryByText('Ticket created')).not.toBeInTheDocument()
  })

  it('can be dismissed with its button', () => {
    renderToasts()
    fireEvent.click(screen.getByRole('button', { name: 'Success' }))

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))

    expect(screen.queryByText('Ticket created')).not.toBeInTheDocument()
  })

  it('only removes the message that was dismissed', () => {
    renderToasts()
    fireEvent.click(screen.getByRole('button', { name: 'Success' }))
    fireEvent.click(screen.getByRole('button', { name: 'Failure' }))

    fireEvent.click(screen.getAllByRole('button', { name: 'Dismiss notification' })[0])

    expect(screen.queryByText('Ticket created')).not.toBeInTheDocument()
    expect(screen.getByText('Something failed')).toBeInTheDocument()
  })

  it('needs the provider', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<Buttons />)).toThrow('useToast must be used inside a ToastProvider')

    error.mockRestore()
  })
})
