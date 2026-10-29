import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useCatalog } from '@/features/catalogs/hooks/useCatalog'
import { useSaveTicket } from '@/features/tickets/hooks/useSaveTicket'
import { useTicket } from '@/features/tickets/hooks/useTicket'
import { ticketSchema } from '@/features/tickets/schema'
import { formatCurrency } from '@/lib/format'
import { inputClass } from '@/lib/inputClass'
import Button from '@/components/ui/Button'
import ErrorMessage from '@/components/ui/ErrorMessage'
import FormField from '@/components/ui/FormField'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import TicketItemsEditor from './TicketItemsEditor'

const EMPTY_VALUES = {
  code: '',
  date: '',
  supplierId: '',
  landId: '',
  items: [{ productId: '', quantity: '', price: '' }],
}

// The API sends decimals as strings
const toFormValues = (ticket) =>
  ticket
    ? {
        code: ticket.code,
        date: ticket.date,
        supplierId: ticket.supplierId,
        landId: ticket.landId,
        items: ticket.items.map((item) => ({
          productId: item.productId,
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
        <FormField label="Supplier" error={errors.supplierId?.message}>
          <select
            className={inputClass(errors.supplierId)}
            {...register('supplierId', { valueAsNumber: true })}
          >
            <option value="">Select...</option>
            {suppliers.data.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.code} - {supplier.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Land" error={errors.landId?.message}>
          <select
            className={inputClass(errors.landId)}
            {...register('landId', { valueAsNumber: true })}
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
