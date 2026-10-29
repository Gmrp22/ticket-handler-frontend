import { useMemo, useState } from 'react'
import { useCatalog } from '../hooks/useCatalog'
import { useDeleteCatalogItem } from '../hooks/useDeleteCatalogItem'
import Button from './Button'
import CatalogFormModal from './CatalogFormModal'
import ConfirmDialog from './ConfirmDialog'
import DataTable from './DataTable'
import ErrorMessage from './ErrorMessage'
import Spinner from './Spinner'

const buildColumns = ({ singular, onEdit, onDelete }) => [
  { header: 'Code', render: (item) => item.code },
  { header: 'Name', render: (item) => item.name },
  {
    header: 'Actions',
    className: 'text-right',
    render: (item) => (
      <div className="flex justify-end gap-2">
        <Button size="sm" aria-label={`Edit ${singular} ${item.code}`} onClick={() => onEdit(item)}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="dangerOutline"
          aria-label={`Delete ${singular} ${item.code}`}
          onClick={() => onDelete(item)}
        >
          Delete
        </Button>
      </div>
    ),
  },
]

// catalog: one of CATALOGS (suppliers, lands or products)
function CatalogTable({ catalog }) {
  // null = form closed; { item: null } = new item; { item } = edit that item
  const [form, setForm] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const { data, isLoading, error } = useCatalog(catalog.id)
  const deleteMutation = useDeleteCatalogItem(catalog.id)

  const columns = useMemo(
    () =>
      buildColumns({
        singular: catalog.singular,
        onEdit: (item) => setForm({ item }),
        onDelete: setItemToDelete,
      }),
    [catalog.singular],
  )

  const closeDeleteDialog = () => {
    setItemToDelete(null)
    deleteMutation.reset()
  }

  const confirmDelete = () => {
    deleteMutation.mutate(itemToDelete.id, { onSuccess: closeDeleteDialog })
  }

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button variant="primary" onClick={() => setForm({ item: null })}>
          New {catalog.singular}
        </Button>
      </div>
      <DataTable
        caption={catalog.label}
        columns={columns}
        rows={data}
        getRowKey={(item) => item.id}
        emptyMessage={`No ${catalog.label.toLowerCase()} found`}
      />
      {form && (
        <CatalogFormModal catalog={catalog} item={form.item} onClose={() => setForm(null)} />
      )}
      {itemToDelete && (
        <ConfirmDialog
          title={`Delete ${catalog.singular}`}
          message={`${itemToDelete.code} - ${itemToDelete.name} will be deleted. This cannot be undone.`}
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

export default CatalogTable
