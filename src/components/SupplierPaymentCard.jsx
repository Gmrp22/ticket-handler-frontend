import { useMemo } from 'react'
import { formatCurrency, formatDate } from '../utils/format'
import Button from './Button'
import DataTable from './DataTable'

const buildColumns = (onViewTicket) => [
  { header: 'Code', render: (ticket) => ticket.code },
  { header: 'Date', render: (ticket) => formatDate(ticket.date) },
  { header: 'Total', className: 'text-right', render: (ticket) => formatCurrency(ticket.total) },
  {
    header: 'Detail',
    className: 'text-right',
    render: (ticket) => <Button onClick={() => onViewTicket(ticket.id)}>View</Button>,
  },
]

// payment: { supplier, total, tickets } as sent by GET /payments
function SupplierPaymentCard({ payment, onViewTicket }) {
  const columns = useMemo(() => buildColumns(onViewTicket), [onViewTicket])

  return (
    <section className="mb-6">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="font-semibold">
          {payment.supplier.name}{' '}
          <span className="text-sm font-normal text-gray-500">({payment.supplier.code})</span>
        </h2>
        <p className="text-sm">
          Payment: <span className="font-semibold">{formatCurrency(payment.total)}</span>
        </p>
      </div>
      <DataTable columns={columns} rows={payment.tickets} getRowKey={(ticket) => ticket.id} />
    </section>
  )
}

export default SupplierPaymentCard
