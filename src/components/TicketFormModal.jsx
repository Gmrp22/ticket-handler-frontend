import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useCatalog } from '../hooks/useCatalog'
import { useSaveTicket } from '../hooks/useSaveTicket'
import { useTicket } from '../hooks/useTicket'
import { ticketSchema } from '../schemas/ticketSchema'
import { formatCurrency } from '../utils/format'
import { inputClass } from '../utils/inputClass'
import Button from './Button'
import ErrorMessage from './ErrorMessage'
import FormField from './FormField'
import Modal from './Modal'
import Spinner from './Spinner'
import TicketItemsEditor from './TicketItemsEditor'

const EMPTY_VALUES = {
  code: '',
  date: '',
  supplier_id: '',
  land_id: '',
  items: [{ product_id: '', quantity: '', price: '' }],
}

// The API sends decimals as strings
const toFormValues = (ticket) =>
  ticket
    ? {
        code: ticket.code,
        date: ticket.date,
        supplier_id: ticket.supplier_id,
        land_id: ticket.land_id,
        items: ticket.TicketItems.map((item) => ({
          product_id: item.product_id,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
      }
    : EMPTY_VALUES

function TicketForm({ ticket, onClose }) {
  const suppliers = useCatalog('suppliers')
  const lands = useCatalog('lands')
  const products = useCatalog('products')
  const saveMutation = useSaveTicket(ticket?.id)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues: toFormValues(ticket),
  })

  const items = useWatch({ control, name: 'items' })
  const total = items.reduce((sum, item) => {
    const subtotal = Number(item.quantity) * Number(item.price)
    return Number.isNaN(subtotal) ? sum : sum + subtotal
  }, 0)

  const catalogs = [suppliers, lands, products]
  if (catalogs.some((catalog) => catalog.isLoading)) return <Spinner />
  const catalogError = catalogs.find((catalog) => catalog.error)?.error
  if (catalogError) return <ErrorMessage message={catalogError.message} />

  const onSubmit = (values) => saveMutation.mutate(values, { onSuccess: onClose })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Code" error={errors.code?.message}>
          <input className={inputClass(errors.code)} {...register('code')} />
        </FormField>
        <FormField label="Date" error={errors.date?.message}>
          <input type="date" className={inputClass(errors.date)} {...register('date')} />
        </FormField>
        <FormField label="Supplier" error={errors.supplier_id?.message}>
          <select
            className={inputClass(errors.supplier_id)}
            {...register('supplier_id', { valueAsNumber: true })}
          >
            <option value="">Select...</option>
            {suppliers.data.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.code} - {supplier.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Land" error={errors.land_id?.message}>
          <select
            className={inputClass(errors.land_id)}
            {...register('land_id', { valueAsNumber: true })}
          >
            <option value="">Select...</option>
            {lands.data.map((land) => (
              <option key={land.id} value={land.id}>
                {land.code} - {land.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <TicketItemsEditor
        control={control}
        register={register}
        errors={errors}
        products={products.data}
      />

      <p className="text-right text-base text-gray-900">
        Total: <span className="font-semibold">{formatCurrency(total)}</span>
      </p>

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
  )
}

// ticketId: id of the ticket to edit, or null to create a new one
function TicketFormModal({ ticketId, onClose }) {
  const { data: ticket, isLoading, error } = useTicket(ticketId)
  const isEdit = ticketId != null

  return (
    <Modal
      title={isEdit ? 'Edit ticket' : 'New ticket'}
      onClose={onClose}
      className="max-w-4xl"
    >
      {isEdit && isLoading && <Spinner />}
      {isEdit && error && <ErrorMessage message={error.message} />}
      {(!isEdit || ticket) && <TicketForm ticket={ticket} onClose={onClose} />}
    </Modal>
  )
}

export default TicketFormModal
