import { createContext, SetStateAction, useRef, useState } from "react"
import DatepickerInput from "./DatepickerInput"
import DatepickerPopup from "./DatepickerPopup"
import styles from './Datepicker.module.css'
import createClasses from "utils/createClasses"
import { MdError } from "react-icons/md"
import Error from "components/Error/Error"

interface Props {
  value: Date | null
  onChange: (date: Date) => void
  disabledDates?: Date[] | ((date: Date) => boolean)
  error?: string | null
  width?: string
  label?: string
  format?: string
  required?: boolean
  placeholder?: string
}

export const DEFAULT_DATEPICKER_FORMAT = 'MM/dd/yyyy' as const
export type DatepickerContextType = Required<Pick<Props, 'value' | 'onChange' | 'disabledDates' | 'error' | 'format'>> & { open: boolean, setOpen: React.Dispatch<SetStateAction<boolean>> }
export const DatepickerContext = createContext<DatepickerContextType>({
  value: null,
  onChange: () => {},
  disabledDates: [],
  error: null,
  format: DEFAULT_DATEPICKER_FORMAT,
  open: false,
  setOpen: () => {}
})

export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const

export default function Datepicker({
  value,
  onChange,
  disabledDates,
  error,
  width,
  label,
  format,
  required,
  placeholder
}: Props) {
  const datepicker = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const ctx = {
    value,
    onChange: (date: Date) => {
      setOpen(false)
      onChange(date)
      datepicker.current?.querySelector('.datepicker-input__input')
    },
    disabledDates: disabledDates ?? [],
    error: error ?? null,
    format: format ?? DEFAULT_DATEPICKER_FORMAT,
    open,
    setOpen
  }

  return (
    <DatepickerContext.Provider value={ctx}>
      <div
        className={createClasses({
          [styles['datepicker']]: true,
          [styles['datepicker--error']]: !!error
        })}
        ref={datepicker}>
        <div className={styles['datepicker__inner']}>
          {label && <label className={styles['datepicker__label']}>{label}</label>}
          <DatepickerInput required={required} placeholder={placeholder} />
          <DatepickerPopup />
        </div>
        {error && <Error>{error}</Error>}
      </div>
    </DatepickerContext.Provider>
  )
}
