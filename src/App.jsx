import { useState } from 'react'
import Layout from './components/Layout'
import PaymentsView from './components/PaymentsView'
import Tabs from './components/Tabs'
import TicketsTable from './components/TicketsTable'

const TABS = [
  { id: 'tickets', label: 'Tickets' },
  { id: 'payments', label: 'Payments' },
]

function App() {
  const [activeTab, setActiveTab] = useState('tickets')

  return (
    <Layout nav={<Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />}>
      {activeTab === 'tickets' && <TicketsTable />}
      {activeTab === 'payments' && <PaymentsView />}
    </Layout>
  )
}

export default App
