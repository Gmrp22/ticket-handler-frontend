import { useFieldArray, useWatch } from 'react-hook-form'
import { formatCurrency } from '@/lib/format'
import Button from '@/components/ui/Button'
import { inputClass } from '@/lib/inputClass'
import { blockInvalidKeys } from '@/lib/numberInput'
import FormField from '@/components/ui/FormField'

const EMPTY_ITEM = { productId: '', quantity: '', price: '' }

function TicketItemsEditor({ control, register, errors, products }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const items = useWatch({ control, name: 'items' })

  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">Items</h3>
      <div className="space-y-3">
        {fields.map((field, index) => {
          const itemErrors = errors.items?.[index]
          const subtotal = Number(items?.[index]?.quantity) * Number(items?.[index]?.price)

          return (
            <div key={field.id} className="grid grid-cols-12 items-start gap-2">
              <div className="col-span-12 sm:col-span-5">
                <FormField label="Product" error={itemErrors?.productId?.message}>
                  <select
                    className={inputClass(itemErrors?.productId)}
                    {...register(`items.${index}.productId`, { valueAsNumber: true })}
                  >
                    <option value="">Select...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.code} - {product.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
              <div className="col-span-6 sm:col-span-2">
                <FormField label="Quantity" error={itemErrors?.quantity?.message}>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    onKeyDown={blockInvalidKeys}
                    className={inputClass(itemErrors?.quantity)}
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  />
                </FormField>
              </div>
              <div className="col-span-6 sm:col-span-2">
                <FormField label="Price" error={itemErrors?.price?.message}>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    onKeyDown={blockInvalidKeys}
                    className={inputClass(itemErrors?.price)}
                    {...register(`items.${index}.price`, { valueAsNumber: true })}
                  />
                </FormField>
              </div>
              <div className="col-span-9 flex h-10 items-center text-base text-gray-900 sm:col-span-2 sm:mt-7 sm:justify-end">
                <span className="mr-1 text-gray-700 sm:sr-only">Subtotal: </span>
                {formatCurrency(Number.isNaN(subtotal) ? 0 : subtotal)}
              </div>
              <div className="col-span-3 flex justify-end sm:col-span-1 sm:mt-7 sm:block">
                <Button
                  aria-label={`Remove item ${index + 1}`}
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  ✕
                </Button>
              </div>
            </div>
          )
        })}
      </div>
      {errors.items?.message && (
        <p className="mt-2 text-sm font-medium text-red-700">
          <span aria-hidden="true">⚠ </span>
          {errors.items.message}
        </p>
      )}
      <Button className="mt-3" onClick={() => append(EMPTY_ITEM)}>
        + Add item
      </Button>
    </div>
  )
}

export default TicketItemsEditor
