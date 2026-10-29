import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSaveCatalogItem } from '../hooks/useSaveCatalogItem'
import { catalogSchema } from '../schemas/catalogSchema'
import { inputClass } from '../utils/inputClass'
import Button from './Button'
import ErrorMessage from './ErrorMessage'
import FormField from './FormField'
import Modal from './Modal'

// item: the item to edit, or null to create a new one
function CatalogFormModal({ catalog, item, onClose }) {
  const saveMutation = useSaveCatalogItem(catalog.id, item?.id)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(catalogSchema),
    defaultValues: { code: item?.code ?? '', name: item?.name ?? '' },
  })

  const onSubmit = (values) => saveMutation.mutate(values, { onSuccess: onClose })

  return (
    <Modal title={`${item ? 'Edit' : 'New'} ${catalog.singular}`} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Code" error={errors.code?.message}>
          <input className={inputClass(errors.code)} {...register('code')} />
        </FormField>
        <FormField label="Name" error={errors.name?.message}>
          <input className={inputClass(errors.name)} {...register('name')} />
        </FormField>

        {saveMutation.error && <ErrorMessage message={saveMutation.error.message} />}

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} disabled={saveMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CatalogFormModal
