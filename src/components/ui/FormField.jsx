import { cloneElement, useId } from 'react'

// children: a single input or select. The error is linked to it for screen readers.
// The error is outside the label, so it is not read twice (as part of the name and as a description).
function FormField({ label, error, children }) {
  const errorId = useId()

  return (
    <div>
      <label className="block">
        <span className="mb-1 block text-base font-medium text-gray-900">{label}</span>
        {cloneElement(children, {
          'aria-invalid': error ? 'true' : undefined,
          'aria-describedby': error ? errorId : undefined,
        })}
      </label>
      {error && (
        <span id={errorId} className="mt-1 block text-sm font-medium text-red-700">
          <span aria-hidden="true">⚠ </span>
          {error}
        </span>
      )}
    </div>
  )
}

export default FormField
