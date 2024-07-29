import { useContext, useEffect, useState } from "react"
import { DatepickerContext, months } from "./Datepicker"
import createClasses from "utils/createClasses"
import styles from './Datepicker.module.css'
import { MdArrowBack, MdArrowForward } from "react-icons/md"
import Select from "components/Select/Select"
import Calendar from "./Calendar"
import { addMonths, getMonth, subMonths } from "date-fns"

export default function DatepickerPopup() {
  const { open, value } = useContext(DatepickerContext)
  const [month, setMonth] = useState(value ?? new Date())

  useEffect(() => {
    if(value) setMonth(value)
  }, [value])

  return (
    <div
      role='dialog'
      aria-label='Datepicker dialog'
      className={createClasses({
        [styles['datepicker-popup']]: true,
        [styles['datepicker-popup--open']]: open
      })}>
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
      <Calendar month={month} />
    </div>
  )
}
