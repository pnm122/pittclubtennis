import Input, { InputRef } from 'components/Input/Input'
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { DatepickerContext } from './Datepicker'
import { formatDate } from 'date-fns'
import { MdCalendarToday } from 'react-icons/md'
import styles from './Datepicker.module.css'
import 'formElement.css'
import createClasses from 'utils/createClasses'
import generateId from 'utils/generateId'

interface Props {
  required?: boolean
  placeholder?: string
  width?: string
  focusCalendar: (wait: boolean) => Promise<boolean>
}

export interface DatepickerInputRef {
  focus: () => void
  id: string
}

const DatepickerInput = forwardRef<DatepickerInputRef, Props>(
  function DatepickerInput(
    { required, placeholder, width, focusCalendar }: Props,
    ref
  ) {
    const id = useRef(generateId())

    useImperativeHandle(ref, () => ({
      focus() {
        input.current?.focus()
      },
      id: id.current
    }))

    const formatValue = (value: string | Date | null): string | null => {
      try {
        if (typeof value === 'string') {
          // Remove 'th', 'st', 'nd', 'rd' from string because evidently Date doesn't want to support these formats
          return formatDate(value.replaceAll(/th|st|nd|rd/g, ''), format)
        } else if (value) {
          return formatDate(value, format)
        } else {
          return null
        }
      } catch {
        return null
      }
    }

    const { format, value, onChange, open, setOpen } =
      useContext(DatepickerContext)
    const [inputValue, setInputValue] = useState(formatValue(value) ?? '')
    const input = useRef<InputRef>(null)

    // Update input on datepicker value change
    useEffect(() => {
      setInputValue(formatValue(value) ?? '')
    }, [value])

    const onBlur = () => {
      const formatted = formatValue(inputValue)
      if (formatted) onChange(new Date(formatted))
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const formatted = formatValue(inputValue)
        if (formatted) onChange(new Date(formatted))
      } else if (e.key === 'ArrowDown') {
        setOpen(true)
        focusCalendar(!open)
      }
    }

    const onClick = () => {
      setOpen(true)
    }

    const onButtonClick = () => {
      setOpen(o => {
        if (!o) {
          focusCalendar(true)
        }
        return !o
      })
    }

    return (
      <div
        id={id.current}
        className={createClasses({
          [styles['datepicker-input']]: true,
          'form-elem__main-control': true,
          'form-elem__main-control--no-padding': true
        })}
        style={{ ...(width ? { width } : {}) }}>
        <Input
          placeholder={placeholder ?? 'Choose a date'}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onClick={onClick}
          name='datepicker-input'
          width='100%'
          required={required}
          ref={input}
          borderless
        />
        <button
          type='button'
          aria-label='Open datepicker dialog'
          aria-haspopup={true}
          aria-pressed={open}
          className={`${styles['datepicker-input__button']} with-hover-circle`}
          onClick={onButtonClick}>
          <MdCalendarToday className={styles['button-icon']} />
        </button>
      </div>
    )
  }
)

export default DatepickerInput
