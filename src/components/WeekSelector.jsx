import {
  formatWeekRange,
  isValidWeek,
  isValidWeekNumber,
  isValidYear,
  shiftWeek,
} from '../utils/week'
import { inputClass } from '../utils/inputClass'
import { blockInvalidKeys } from '../utils/numberInput'
import Button from './Button'
import FormField from './FormField'

// year and week are numbers, or '' while the user is typing
function WeekSelector({ year, week, onChange }) {
  const isValid = isValidWeek(year, week)

  const handleShift = (amount) => {
    const next = shiftWeek(year, week, amount)
    onChange(next.year, next.week)
  }

  const toValue = (text) => (text === '' ? '' : Number(text))

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-28">
          <FormField label="Year">
            <input
              type="number"
              min="1900"
              max="2100"
              onKeyDown={blockInvalidKeys}
              className={inputClass(!isValidYear(year))}
              value={year}
              onChange={(event) => onChange(toValue(event.target.value), week)}
            />
          </FormField>
        </div>
        <div className="w-24">
          <FormField label="Week">
            <input
              type="number"
              min="1"
              max="53"
              onKeyDown={blockInvalidKeys}
              className={inputClass(!isValidWeekNumber(week))}
              value={week}
              onChange={(event) => onChange(year, toValue(event.target.value))}
            />
          </FormField>
        </div>
        <Button aria-label="Previous week" disabled={!isValid} onClick={() => handleShift(-1)}>
          ‹ Previous
        </Button>
        <Button aria-label="Next week" disabled={!isValid} onClick={() => handleShift(1)}>
          Next ›
        </Button>
      </div>
      <p className="mt-2 text-base text-gray-700" aria-live="polite">
        {isValid
          ? formatWeekRange(year, week)
          : 'Year must be between 1900 and 2100, and week between 1 and 53'}
      </p>
    </div>
  )
}

export default WeekSelector
