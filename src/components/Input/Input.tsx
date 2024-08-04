import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import 'formElement.css'
import createClasses from 'utils/createClasses'
import Error from 'components/Error/Error'

interface Props {
  placeholder?: string
  label?: string
  type?: React.InputHTMLAttributes<HTMLInputElement>['type']
  name: string
  value?: string
  selection?: { start: number, end: number }
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onSelect?: React.ReactEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBeforeInput?: React.FormEventHandler<HTMLInputElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onClick?: React.MouseEventHandler<HTMLInputElement>
  error?: string
  required?: boolean
  borderless?: boolean
  width?: string
}

export interface InputRef {
  focus: () => void
}

const Input = forwardRef<InputRef, Props>(function Input({
  placeholder,
  label,
  type,
  name,
  value,
  onChange,
  onSelect,
  onFocus,
  onBeforeInput,
  onKeyDown,
  onBlur,
  onClick,
  error,
  required,
  borderless,
  width
}: Props, ref) {
  useImperativeHandle(ref, () => ({
    focus() {
      input.current?.focus()
    }
  }))

  const input = useRef<HTMLInputElement>(null)

  const inputGroupClasses = createClasses({
    'form-elem': true,
    'form-elem--error': !!error
  })

  return (
    <div className={inputGroupClasses} style={{...(width ? { width } : {})}}>
      {!!label && (
        <label className={'form-elem__label'} htmlFor={name}>
          {label}
          {required && <span className={'required-star'}>*</span>}
        </label>
      )}
      <input
        className={createClasses({
          'form-elem__main-control': true,
          'form-elem__main-control--borderless': !!borderless
        })}
        value={value}
        name={name}
        type={type}
        placeholder={placeholder}
        onBeforeInput={(e) => onBeforeInput && onBeforeInput(e)}
        onChange={(e) => onChange && onChange(e)}
        onSelect={(e) => onSelect && onSelect(e)}
        onFocus={(e) => onFocus && onFocus(e)}
        onKeyDown={(e) => onKeyDown && onKeyDown(e)}
        onBlur={(e) => onBlur && onBlur(e)}
        onClick={(e) => onClick && onClick(e)}
        required={required}
        ref={input}
      />
      {!!error && <Error>{error}</Error>}
    </div>
  )
})

export default Input
