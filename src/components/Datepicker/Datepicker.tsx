import { createContext, SetStateAction, useEffect, useRef, useState } from "react"
import DatepickerInput, { DatepickerInputRef } from "./DatepickerInput"
import DatepickerPopup, { PopupRef } from "./DatepickerPopup"
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
export type DatepickerContextType =
  Required<
    Pick<
      Props,
      'value' | 'onChange' | 'disabledDates' | 'error' | 'format'
    >
  > & {
    open: boolean,
    setOpen: React.Dispatch<SetStateAction<boolean>>
    focusInput: () => void
  }
export const DatepickerContext = createContext<DatepickerContextType>({
  value: null,
  onChange: () => {},
  disabledDates: [],
  error: null,
  format: DEFAULT_DATEPICKER_FORMAT,
  open: false,
  setOpen: () => {},
  focusInput: () => {}
})

export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const

let resolveRenderPromise: (() => void) | null = null

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
  const popup = useRef<PopupRef>(null)
  const input = useRef<DatepickerInputRef>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if(resolveRenderPromise) {
      resolveRenderPromise()
      resolveRenderPromise = null
    }
  })

  const waitForRender = async () => {
    await new Promise<void>(res => {
      resolveRenderPromise = res
    })
  }

  const focusCalendar = async (wait: boolean) => {
    if(wait) await waitForRender()
    return !!popup.current?.focusCalendar()
  }

  const focusInput = () => {
    input.current?.focus()
  }

  const onBlur = (e: React.FocusEvent) => {
    const { relatedTarget } = e
    const inPopup = relatedTarget?.closest(`.${styles['datepicker-popup']}`)
    const inInput = relatedTarget?.closest(`.${styles['datepicker-input']}`)
    if(!(inPopup || inInput)) {
      setOpen(false)
    }
  }

  const ctx = {
    value,
    onChange: (date: Date) => {
      onChange(date)
    },
    disabledDates: disabledDates ?? [],
    error: error ?? null,
    format: format ?? DEFAULT_DATEPICKER_FORMAT,
    open,
    setOpen,
    focusInput
  }

  return (
    <DatepickerContext.Provider value={ctx}>
      <div
        className={createClasses({
          [styles['datepicker']]: true,
          [styles['datepicker--error']]: !!error
        })}
        ref={datepicker}
        onBlur={onBlur}>
        <div className={styles['datepicker__inner']}>
          {label && <label className={styles['datepicker__label']}>{label}</label>}
          <DatepickerInput
            required={required}
            placeholder={placeholder}
            focusCalendar={focusCalendar}
            ref={input}
          />
          <DatepickerPopup ref={popup} />
        </div>
        {error && <Error>{error}</Error>}
      </div>
    </DatepickerContext.Provider>
  )
}
