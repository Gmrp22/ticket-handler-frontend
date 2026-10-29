import { cloneElement, useId } from 'react'

// children: a single input or select. The error is linked to it for screen readers.
function FormField({ label, error, children }) {
  const errorId = useId()

  return (
    <label className="block">
      <span className="mb-1 block text-base font-medium text-gray-900">{label}</span>
      {cloneElement(children, {
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': error ? errorId : undefined,
      })}
      {error && (
        <span id={errorId} className="mt-1 block text-sm font-medium text-red-700">
          <span aria-hidden="true">⚠ </span>
          {error}
        </span>
      )}
    </label>
  )
}

export default FormField
