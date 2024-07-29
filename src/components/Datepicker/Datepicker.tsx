import { createContext, SetStateAction, useState } from "react"
import DatepickerInput from "./DatepickerInput"
import { formatDate } from "date-fns"

interface Props {
  value: Date | null
  onChange: (date: Date) => void
  disabledDates?: Date[] | ((date: Date) => boolean)
  error?: string | null
  width?: string
  label?: string
  format?: string
  required?: boolean
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

export default function Datepicker({
  value,
  onChange,
  disabledDates,
  error,
  width,
  label,
  format
}: Props) {
  const [open, setOpen] = useState(false)

  const ctx = {
    value,
    onChange: (date: Date) => {
      setOpen(false)
      onChange(date)
    },
    disabledDates: disabledDates ?? [],
    error: error ?? null,
    format: format ?? DEFAULT_DATEPICKER_FORMAT,
    open,
    setOpen
  }

  return (
    <DatepickerContext.Provider value={ctx}>
      <DatepickerInput />
    </DatepickerContext.Provider>
  )
}
