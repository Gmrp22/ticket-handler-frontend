import { useState } from 'react'
import { usePayments } from '../hooks/usePayments'
import { formatCurrency } from '../utils/format'
import { getCurrentWeek, isValidWeek } from '../utils/week'
import ErrorMessage from './ErrorMessage'
import Spinner from './Spinner'
import SupplierPaymentCard from './SupplierPaymentCard'
import TicketDetailModal from './TicketDetailModal'
import WeekSelector from './WeekSelector'

function PaymentsView() {
  const [{ year, week }, setSelection] = useState(getCurrentWeek)
  const [ticketIdToView, setTicketIdToView] = useState(null)
  const { data, isLoading, error } = usePayments(year, week)

  const handleWeekChange = (nextYear, nextWeek) => setSelection({ year: nextYear, week: nextWeek })

  return (
    <>
      <WeekSelector year={year} week={week} onChange={handleWeekChange} />

      <div className="mt-6">
        {isLoading && <Spinner />}
        {error && <ErrorMessage message={error.message} />}
        {isValidWeek(year, week) && data && (
          <>
            <p className="mb-4 text-right text-sm">
              Total to pay: <span className="font-semibold">{formatCurrency(data.total)}</span>
            </p>
            {data.suppliers.length === 0 ? (
              <p className="rounded border border-gray-200 bg-white px-4 py-8 text-center text-gray-500">
                No payments this week
              </p>
            ) : (
              data.suppliers.map((payment) => (
                <SupplierPaymentCard
                  key={payment.supplier.id}
                  payment={payment}
                  onViewTicket={setTicketIdToView}
                />
              ))
            )}
          </>
        )}
      </div>

      {ticketIdToView && (
        <TicketDetailModal ticketId={ticketIdToView} onClose={() => setTicketIdToView(null)} />
      )}
    </>
  )
}

export default PaymentsView
