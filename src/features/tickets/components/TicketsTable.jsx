import { useMemo, useState } from 'react'
import { useDeleteTicket } from '@/features/tickets/hooks/useDeleteTicket'
import { useTickets } from '@/features/tickets/hooks/useTickets'
import { formatCurrency, formatDate } from '@/lib/format'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import DataTable from '@/components/ui/DataTable'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Pagination from '@/components/ui/Pagination'
import Spinner from '@/components/ui/Spinner'
import TicketDetailModal from './TicketDetailModal'
import TicketFormModal from './TicketFormModal'

const buildColumns = ({ onView, onEdit, onDelete }) => [
  { header: 'Code', sortKey: 'code', render: (ticket) => ticket.code },
  { header: 'Date', sortKey: 'date', render: (ticket) => formatDate(ticket.date) },
  { header: 'Supplier', render: (ticket) => ticket.supplier.name },
  { header: 'Land', render: (ticket) => ticket.land.name },
  {
    header: 'Total',
    className: 'text-right',
    render: (ticket) => formatCurrency(ticket.total),
  },
  {
    header: 'Actions',
    mobileLabel: false,
    className: 'text-right',
    render: (ticket) => (
      <div className="flex justify-end gap-2">
        <Button size="sm" aria-label={`View ticket ${ticket.code}`} onClick={() => onView(ticket)}>
          View
        </Button>
        <Button size="sm" aria-label={`Edit ticket ${ticket.code}`} onClick={() => onEdit(ticket)}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="dangerOutline"
          aria-label={`Delete ticket ${ticket.code}`}
          onClick={() => onDelete(ticket)}
        >
          Delete
        </Button>
      </div>
    ),
  },
]

function TicketsTable() {
  const [page, setPage] = useState(1)
  // Same default as the API: newest first
  const [sort, setSort] = useState({ key: 'date', order: 'desc' })
  const [ticketToView, setTicketToView] = useState(null)
  const [ticketToDelete, setTicketToDelete] = useState(null)
  // null = form closed; { ticketId: null } = new ticket; { ticketId: 5 } = edit ticket 5
  const [form, setForm] = useState(null)
  const { data, isLoading, error } = useTickets({ page, sort: sort.key, order: sort.order })
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

  // Same column again: flips the order. Another column: starts ascending.
  // The order changes the pages, so it goes back to the first one.
  const handleSort = (key) => {
    setSort((current) => ({
      key,
      order: current.key === key && current.order === 'asc' ? 'desc' : 'asc',
    }))
    setPage(1)
  }

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
        caption="Tickets"
        columns={columns}
        rows={data.data}
        getRowKey={(ticket) => ticket.id}
        sort={sort}
        onSort={handleSort}
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
