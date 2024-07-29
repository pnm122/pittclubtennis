import { getMonth, isSameMonth } from "date-fns"
import styles from './Datepicker.module.css'
import createClasses from "utils/createClasses"
import { useContext } from "react"
import { DatepickerContext, months } from "./Datepicker"

interface Props {
  date: Date
  selected: boolean
  disabled: boolean
  month: Date
}

export default function CalendarDay({
  date,
  selected,
  disabled,
  month
}: Props) {
  const { onChange } = useContext(DatepickerContext)

  return (
    <td className={styles['day-cell']}>
      {isSameMonth(date, month) && (
        <button
          aria-label={`${months[getMonth(month)]} ${date.getDate()}`}
          aria-disabled={disabled}
          className={createClasses({
            'with-hover-circle': !disabled,
            [styles['day']]: true,
            [styles['day--selected']]: selected,
            [styles['day--disabled']]: disabled
          })}
          onClick={() => !disabled && onChange(date)}>
          {date.getDate()}
        </button>
      )}
    </td>
  )
}
