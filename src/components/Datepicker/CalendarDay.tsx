import { getMonth, isSameMonth } from 'date-fns'
import styles from './Datepicker.module.css'
import createClasses from 'utils/createClasses'
import { useContext } from 'react'
import { DatepickerContext, months } from './Datepicker'

interface Props {
  date: Date
  selected: boolean
  disabled: boolean
  focused: boolean
  month: Date
}

export default function CalendarDay({
  date,
  selected,
  disabled,
  focused,
  month
}: Props) {
  const { onChange } = useContext(DatepickerContext)

  return (
    <td
      className={styles['day-cell']}
      role='gridcell'>
      {isSameMonth(date, month) && (
        <button
          type='button'
          tabIndex={-1}
          aria-label={`${months[getMonth(month)]} ${date.getDate()}`}
          aria-disabled={disabled}
          className={createClasses({
            'with-hover-circle': true,
            [styles['day']]: true,
            [styles['day--selected']]: selected,
            [styles['day--disabled']]: disabled,
            [styles['day--focused']]: focused
          })}
          onClick={() => !disabled && onChange(date)}>
          {date.getDate()}
        </button>
      )}
    </td>
  )
}
