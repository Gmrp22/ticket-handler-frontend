import Button from './Button'
import ErrorMessage from './ErrorMessage'
import Modal from './Modal'

function ConfirmDialog({ title, message, confirmLabel = 'Confirm', isLoading, error, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="mb-4 text-base text-gray-900">{message}</p>
      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}
      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Deleting...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
