import { useMemo, useState } from 'react'
import { useDeleteTicket } from '../hooks/useDeleteTicket'
import { useTickets } from '../hooks/useTickets'
import { formatCurrency, formatDate } from '../utils/format'
import Button from './Button'
import ConfirmDialog from './ConfirmDialog'
import DataTable from './DataTable'
import ErrorMessage from './ErrorMessage'
import Pagination from './Pagination'
import Spinner from './Spinner'
import TicketDetailModal from './TicketDetailModal'
import TicketFormModal from './TicketFormModal'

const buildColumns = ({ onView, onEdit, onDelete }) => [
  { header: 'Code', render: (ticket) => ticket.code },
  { header: 'Date', render: (ticket) => formatDate(ticket.date) },
  { header: 'Supplier', render: (ticket) => ticket.Supplier.name },
  { header: 'Land', render: (ticket) => ticket.Land.name },
  {
    header: 'Total',
    className: 'text-right',
    render: (ticket) => formatCurrency(ticket.total),
  },
  {
    header: 'Actions',
    className: 'text-right',
    render: (ticket) => (
      <div className="flex justify-end gap-2">
        <Button onClick={() => onView(ticket)}>View</Button>
        <Button onClick={() => onEdit(ticket)}>Edit</Button>
        <Button variant="danger" onClick={() => onDelete(ticket)}>
          Delete
        </Button>
      </div>
    ),
  },
]

function TicketsTable() {
  const [page, setPage] = useState(1)
  const [ticketToView, setTicketToView] = useState(null)
  const [ticketToDelete, setTicketToDelete] = useState(null)
  // null = form closed; { ticketId: null } = new ticket; { ticketId: 5 } = edit ticket 5
  const [form, setForm] = useState(null)
  const { data, isLoading, error } = useTickets(page)
  const deleteMutation = useDeleteTicket()

  // The state setters never change, so the columns are built only once
  const columns = useMemo(
    () =>
      buildColumns({
        onView: setTicketToView,
        onEdit: (ticket) => setForm({ ticketId: ticket.id }),
        onDelete: setTicketToDelete,
      }),
    [],
  )

  const closeDeleteDialog = () => {
    setTicketToDelete(null)
    deleteMutation.reset()
  }

  const confirmDelete = () => {
    deleteMutation.mutate(ticketToDelete.id, {
      onSuccess: () => {
        // Deleting the only ticket of the last page leaves that page empty
        if (data.data.length === 1 && page > 1) setPage(page - 1)
        closeDeleteDialog()
      },
    })
  }

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button variant="primary" onClick={() => setForm({ ticketId: null })}>
          New ticket
        </Button>
      </div>
      <DataTable
        columns={columns}
        rows={data.data}
        getRowKey={(ticket) => ticket.id}
        emptyMessage="No tickets found"
      />
      <Pagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
        onPageChange={setPage}
      />
      {form && (
        <TicketFormModal ticketId={form.ticketId} onClose={() => setForm(null)} />
      )}
      {ticketToView && (
        <TicketDetailModal
          ticketId={ticketToView.id}
          onClose={() => setTicketToView(null)}
        />
      )}
      {ticketToDelete && (
        <ConfirmDialog
          title="Delete ticket"
          message={`Ticket ${ticketToDelete.code} and all its items will be deleted. This cannot be undone.`}
          confirmLabel="Delete"
          isLoading={deleteMutation.isPending}
          error={deleteMutation.error?.message}
          onConfirm={confirmDelete}
          onCancel={closeDeleteDialog}
        />
      )}
    </>
  )
}

export default TicketsTable
