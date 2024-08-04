import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import { DatepickerContext, months } from "./Datepicker"
import createClasses from "utils/createClasses"
import styles from './Datepicker.module.css'
import { MdArrowBack, MdArrowForward } from "react-icons/md"
import Select, { SelectRef } from "components/Select/Select"
import Calendar, { CalendarRef } from "./Calendar"
import { addMonths, getMonth, subMonths } from "date-fns"

export interface PopupRef {
  focusCalendar: () => boolean
}

const DatepickerPopup = forwardRef<PopupRef>(function DatepickerPopup(_, ref) {
  const { open, setOpen, value, focusInput } = useContext(DatepickerContext)
  const [month, setMonth] = useState(value ?? new Date())
  const calendar = useRef<CalendarRef>(null)

  useImperativeHandle(ref, () => {
    return {
      focusCalendar() {
        if(calendar.current) {
          calendar.current.focus()
          return true
        } else {
          return false
        }
      }
    }
  }, [])

  useEffect(() => {
    if(value) setMonth(value)
  }, [value])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === 'Escape') {
      setOpen(false)
      focusInput()
    }
  }

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-label='Datepicker dialog'
      className={createClasses({
        [styles['datepicker-popup']]: true,
        [styles['datepicker-popup--open']]: open
      })}
      onKeyDown={onKeyDown}>
      <div className={styles['popup-header']}>
        <button
          aria-label='Previous month'
          className={`${styles['popup-header__button']} with-hover-circle`}
          onClick={() => setMonth(subMonths(month, 1))}>
          <MdArrowBack />
        </button>
        <Select
          options={months.map(m => ({ value: m }))}
          value={getMonth(month)}
          onChange={({ selected }) => setMonth(new Date(`${selected} ${month.getFullYear()}`))}
          width='120px'
        />
        <button
          aria-label='Next month'
          className={`${styles['popup-header__button']} with-hover-circle`}
          onClick={() => setMonth(addMonths(month, 1))}>
          <MdArrowForward />
        </button>
      </div>
      <Calendar month={month} setMonth={setMonth} ref={calendar} />
    </div>
  )
})

export default DatepickerPopup