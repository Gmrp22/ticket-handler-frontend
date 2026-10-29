import { createContext, useContext } from 'react'

export const ToastContext = createContext(null)

// Returns { showToast(message, type) }, type: 'success' (default) or 'error'
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside a ToastProvider')
  return context
}
