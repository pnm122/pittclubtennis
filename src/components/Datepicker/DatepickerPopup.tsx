import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { DatepickerContext, months } from './Datepicker'
import createClasses from 'utils/createClasses'
import styles from './Datepicker.module.css'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'
import Select, { SelectRef } from 'components/Select/Select'
import Calendar, { CalendarRef } from './Calendar'
import { addMonths, getMonth, subMonths } from 'date-fns'
import waitFor from 'utils/waitFor'
import generateId from 'utils/generateId'

export interface PopupRef {
  focusCalendar: () => boolean
  id: string
}

const DatepickerPopup = forwardRef<PopupRef>(function DatepickerPopup(_, ref) {
  const id = useRef(generateId())
  const { open, setOpen, value, focusInput } = useContext(DatepickerContext)
  const [month, setMonth] = useState(value ?? new Date())
  const calendar = useRef<CalendarRef>(null)

  useImperativeHandle(ref, () => {
    return {
      focusCalendar() {
        if (calendar.current) {
          calendar.current.focus()
          return true
        } else {
          return false
        }
      },
      id: id.current
    }
  }, [])

  useEffect(() => {
    if (value) setMonth(value)
  }, [value])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
      focusInput()
    }
  }

  const setMonthAndInitFocusedDate = async (newMonth: Date) => {
    setMonth(newMonth)
    await waitFor(() => month === newMonth)
    calendar.current?.initFocusedDate()
  }

  return (
    <div
      role='dialog'
      aria-label='Datepicker dialog'
      id={id.current}
      className={createClasses({
        [styles['datepicker-popup']]: true,
        [styles['datepicker-popup--open']]: open
      })}
      onKeyDown={onKeyDown}>
      <div className={styles['popup-header']}>
        <button
          type='button'
          aria-label='Previous month'
          className={`${styles['popup-header__button']} with-hover-circle`}
          onClick={() => setMonthAndInitFocusedDate(subMonths(month, 1))}>
          <MdArrowBack />
        </button>
        <Select
          options={months}
          value={months[getMonth(month)]}
          onChange={(selected) =>
            setMonthAndInitFocusedDate(
              new Date(month.getFullYear(), months.findIndex(m => m === selected))
            )
          }
          width='120px'
        />
        <button
          type='button'
          aria-label='Next month'
          className={`${styles['popup-header__button']} with-hover-circle`}
          onClick={() => setMonthAndInitFocusedDate(addMonths(month, 1))}>
          <MdArrowForward />
        </button>
      </div>
      <Calendar
        month={month}
        setMonth={setMonth}
        ref={calendar}
      />
    </div>
  )
})

export default DatepickerPopup
