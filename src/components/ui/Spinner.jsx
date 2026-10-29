function Spinner() {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-base text-gray-900" role="status">
      <div
        className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-700"
        aria-hidden="true"
      />
      Loading...
    </div>
  )
}

export default Spinner
