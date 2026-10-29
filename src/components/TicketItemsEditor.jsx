import { useFieldArray, useWatch } from 'react-hook-form'
import { formatCurrency } from '../utils/format'
import Button from './Button'
import { inputClass } from '../utils/inputClass'
import { blockInvalidKeys } from '../utils/numberInput'
import FormField from './FormField'

const EMPTY_ITEM = { product_id: '', quantity: '', price: '' }

function TicketItemsEditor({ control, register, errors, products }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const items = useWatch({ control, name: 'items' })

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">Items</h3>
      <div className="space-y-3">
        {fields.map((field, index) => {
          const itemErrors = errors.items?.[index]
          const subtotal = Number(items?.[index]?.quantity) * Number(items?.[index]?.price)

          return (
            <div key={field.id} className="grid grid-cols-12 items-start gap-2">
              <div className="col-span-12 sm:col-span-5">
                <FormField label="Product" error={itemErrors?.product_id?.message}>
                  <select
                    className={inputClass(itemErrors?.product_id)}
                    {...register(`items.${index}.product_id`, { valueAsNumber: true })}
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
              <div className="col-span-4 sm:col-span-2">
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
              <div className="col-span-4 sm:col-span-2">
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
              <div className="col-span-3 pt-7 text-right text-sm sm:col-span-2">
                {formatCurrency(Number.isNaN(subtotal) ? 0 : subtotal)}
              </div>
              <div className="col-span-1 pt-6">
                <Button
                  aria-label="Remove item"
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
        <p className="mt-2 text-xs text-red-600">{errors.items.message}</p>
      )}
      <Button className="mt-3" onClick={() => append(EMPTY_ITEM)}>
        + Add item
      </Button>
    </div>
  )
}

export default TicketItemsEditor
