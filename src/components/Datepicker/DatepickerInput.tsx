import Input from 'components/Input/Input'
import { useContext, useEffect, useState } from 'react'
import { DatepickerContext } from './Datepicker'
import { formatDate } from 'date-fns'
import { MdCalendarToday } from 'react-icons/md'
import styles from './Datepicker.module.css'

export default function DatepickerInput() {
  const formatValue = (value: string | Date | null): string | null => {
    try {
      if(value) return formatDate(value, format)
      else return null
    } catch {
      return null
    }
  }

  const { format, value, onChange, setOpen } = useContext(DatepickerContext)
  const [inputValue, setInputValue] = useState(formatValue(value) ?? '')

  // Update input on datepicker value change
  useEffect(() => {
    setInputValue(formatValue(value) ?? '')
  }, [value])

  const onBlur = () => {
    const formatted = formatValue(inputValue)
    if(formatted) onChange(new Date(formatted))
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      const formatted = formatValue(inputValue)
      if(formatted) onChange(new Date(formatted))
    }
  }

  return (
    <div className={styles['datepicker-input']}>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        name='datepicker-input'
        width='100%'
        borderless
      />
      <button
        className={`${styles['datepicker-input__button']} with-hover-circle`}
        onClick={() => setOpen(o => !o)}>
        <MdCalendarToday className={styles['button-icon']} />
      </button>
    </div>
  )
}
