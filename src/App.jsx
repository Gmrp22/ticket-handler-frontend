import { useState } from 'react'
import CatalogsView from '@/features/catalogs/components/CatalogsView'
import Layout from '@/components/layout/Layout'
import PaymentsView from '@/features/payments/components/PaymentsView'
import Tabs from '@/components/ui/Tabs'
import TicketsTable from '@/features/tickets/components/TicketsTable'

const TABS = [
  { id: 'tickets', label: 'Tickets' },
  { id: 'payments', label: 'Payments' },
  { id: 'catalogs', label: 'Catalogs' },
]

function App() {
  const [activeTab, setActiveTab] = useState('tickets')

  return (
    <Layout nav={<Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />}>
      {activeTab === 'tickets' && <TicketsTable />}
      {activeTab === 'payments' && <PaymentsView />}
      {activeTab === 'catalogs' && <CatalogsView />}
    </Layout>
  )
}

export default App
