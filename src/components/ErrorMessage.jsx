// The icon and the word "Error" make it clear without depending on the red color
function ErrorMessage({ message }) {
  return (
    <div
      className="flex gap-2 rounded-md border border-red-700 bg-red-50 px-4 py-3 text-base text-red-900"
      role="alert"
    >
      <span aria-hidden="true">⚠</span>
      <p>
        <span className="font-semibold">Error:</span> {message}
      </p>
    </div>
  )
}

export default ErrorMessage
