import { useTicket } from '../hooks/useTicket'
import { formatCurrency, formatDate, formatNumber } from '../utils/format'
import Button from './Button'
import DataTable from './DataTable'
import ErrorMessage from './ErrorMessage'
import Modal from './Modal'
import Spinner from './Spinner'

const itemColumns = [
  { header: 'Product', render: (item) => `${item.product.code} - ${item.product.name}` },
  { header: 'Quantity', className: 'text-right', render: (item) => formatNumber(item.quantity) },
  { header: 'Price', className: 'text-right', render: (item) => formatCurrency(item.price) },
  {
    header: 'Subtotal',
    className: 'text-right',
    render: (item) => formatCurrency(Number(item.quantity) * Number(item.price)),
  },
]

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-sm text-gray-700">{label}</dt>
      <dd className="text-base font-medium text-gray-900">{value}</dd>
    </div>
  )
}

function TicketDetailModal({ ticketId, onClose }) {
  const { data: ticket, isLoading, error } = useTicket(ticketId)

  return (
    <Modal title="Ticket detail" onClose={onClose} className="max-w-3xl">
      {isLoading && <Spinner />}
      {error && <ErrorMessage message={error.message} />}
      {ticket && (
        <>
          <dl className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Code" value={ticket.code} />
            <Field label="Date" value={formatDate(ticket.date)} />
            <Field label="Supplier" value={ticket.supplier.name} />
            <Field label="Land" value={ticket.land.name} />
          </dl>
          <DataTable
            caption={`Items of ticket ${ticket.code}`}
            columns={itemColumns}
            rows={ticket.items}
            getRowKey={(item) => item.id}
            emptyMessage="This ticket has no items"
          />
          <p className="mt-4 text-right text-base text-gray-900">
            Total: <span className="font-semibold">{formatCurrency(ticket.total)}</span>
          </p>
        </>
      )}
      <div className="mt-4 flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  )
}

export default TicketDetailModal
