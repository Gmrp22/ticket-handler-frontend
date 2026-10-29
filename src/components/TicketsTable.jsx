import { useState } from 'react'
import { useTickets } from '../hooks/useTickets'
import { formatCurrency, formatDate } from '../utils/format'
import Button from './Button'
import DataTable from './DataTable'
import ErrorMessage from './ErrorMessage'
import Pagination from './Pagination'
import Spinner from './Spinner'

const columns = [
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
    render: () => (
      <div className="flex justify-end gap-2">
        <Button>View</Button>
        <Button>Edit</Button>
        <Button variant="danger">Delete</Button>
      </div>
    ),
  },
]

function TicketsTable() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useTickets(page)

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
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
    </>
  )
}

export default TicketsTable
