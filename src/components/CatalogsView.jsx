import { useState } from 'react'
import { CATALOGS } from '../utils/catalogs'
import CatalogTable from './CatalogTable'
import Tabs from './Tabs'

function CatalogsView() {
  const [activeId, setActiveId] = useState(CATALOGS[0].id)
  const catalog = CATALOGS.find((item) => item.id === activeId)

  return (
    <>
      <div className="mb-4">
        <Tabs tabs={CATALOGS} active={activeId} onChange={setActiveId} label="Catalogs" />
      </div>
      {/* The key resets the state of the table when the catalog changes */}
      <CatalogTable key={catalog.id} catalog={catalog} />
    </>
  )
}

export default CatalogsView
