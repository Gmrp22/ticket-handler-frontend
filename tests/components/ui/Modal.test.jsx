import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Modal from '@/components/ui/Modal'

const renderModal = (onClose = vi.fn()) =>
  render(
    <Modal title="Delete ticket" onClose={onClose}>
      <button>First</button>
      <button>Last</button>
    </Modal>,
  )

describe('Modal', () => {
  it('is a dialog named by its title', () => {
    renderModal()

    expect(screen.getByRole('dialog', { name: 'Delete ticket' })).toBeInTheDocument()
  })

  it('moves the focus into the dialog when it opens', () => {
    renderModal()

    expect(screen.getByRole('dialog')).toHaveFocus()
  })

  it('closes with Escape', async () => {
    const onClose = vi.fn()
    renderModal(onClose)

    await userEvent.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes when the background is clicked, but not the dialog', async () => {
    const onClose = vi.fn()
    const { container } = renderModal(onClose)

    await userEvent.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()

    await userEvent.click(container.firstChild)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('keeps Tab inside the dialog', async () => {
    renderModal()
    const first = screen.getByRole('button', { name: 'First' })
    const last = screen.getByRole('button', { name: 'Last' })

    await userEvent.tab()
    expect(first).toHaveFocus()
    await userEvent.tab()
    expect(last).toHaveFocus()
    await userEvent.tab()
    expect(first).toHaveFocus()
  })

  it('keeps Shift+Tab inside the dialog', async () => {
    renderModal()
    const first = screen.getByRole('button', { name: 'First' })
    const last = screen.getByRole('button', { name: 'Last' })

    await userEvent.tab()
    expect(first).toHaveFocus()
    await userEvent.tab({ shift: true })
    expect(last).toHaveFocus()
  })

  it('gives the focus back to what opened it', () => {
    render(<button>Open</button>)
    const opener = screen.getByRole('button', { name: 'Open' })
    opener.focus()

    const { unmount } = renderModal()
    expect(opener).not.toHaveFocus()

    unmount()
    expect(opener).toHaveFocus()
  })
})
