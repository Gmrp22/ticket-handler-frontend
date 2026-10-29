import Button from './Button'

function Pagination({ page, totalPages, onPageChange }) {
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between pt-4">
      <span className="text-base text-gray-900" aria-live="polite">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </nav>
  )
}

export default Pagination
