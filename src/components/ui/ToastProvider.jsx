import { useCallback, useEffect, useMemo, useState } from 'react'
import { ToastContext } from '@/lib/toastContext'

const DURATION = 5000

const STYLES = {
  success: 'border-green-700 bg-green-50 text-green-900',
  error: 'border-red-700 bg-red-50 text-red-900',
}
// The icon and the text say the type, so it does not depend on the color
const ICONS = { success: '✓', error: '⚠' }

let nextId = 0

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), DURATION)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className={`flex items-start gap-2 rounded-md border px-4 py-3 text-base shadow-lg ${STYLES[toast.type]}`}
    >
      <span aria-hidden="true">{ICONS[toast.type]}</span>
      <p className="flex-1">{toast.message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        className="rounded px-1 font-semibold hover:bg-black/10"
        onClick={() => onDismiss(toast.id)}
      >
        ✕
      </button>
    </div>
  )
}

// Shows short messages (for example "Ticket created") that disappear after a few seconds.
// The region is always in the page, so screen readers announce what is added to it.
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    setToasts((current) => [...current, { id: nextId++, message, type }])
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        className="fixed inset-x-4 bottom-4 z-30 flex flex-col gap-2 sm:left-auto sm:w-96"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
