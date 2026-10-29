import { useMemo } from 'react'
import { formatCurrency, formatDate } from '@/lib/format'
import Button from '@/components/ui/Button'
import DataTable from '@/components/ui/DataTable'

const buildColumns = (onViewTicket) => [
  { header: 'Code', render: (ticket) => ticket.code },
  { header: 'Date', render: (ticket) => formatDate(ticket.date) },
  { header: 'Total', className: 'text-right', render: (ticket) => formatCurrency(ticket.total) },
  {
    header: 'Detail',
    className: 'text-right',
    render: (ticket) => (
      <Button
        size="sm"
        aria-label={`View ticket ${ticket.code}`}
        onClick={() => onViewTicket(ticket.id)}
      >
        View
      </Button>
    ),
  },
]

// payment: { supplier, total, tickets } as sent by GET /payments
function SupplierPaymentCard({ payment, onViewTicket }) {
  const columns = useMemo(() => buildColumns(onViewTicket), [onViewTicket])

  return (
    <section className="mb-6">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-900">
          {payment.supplier.name}{' '}
          <span className="text-base font-normal text-gray-700">({payment.supplier.code})</span>
        </h2>
        <p className="text-base text-gray-900">
          Payment: <span className="font-semibold">{formatCurrency(payment.total)}</span>
        </p>
      </div>
      <DataTable
        caption={`Tickets paid to ${payment.supplier.name}`}
        columns={columns}
        rows={payment.tickets}
        getRowKey={(ticket) => ticket.id}
      />
    </section>
  )
}

export default SupplierPaymentCard
