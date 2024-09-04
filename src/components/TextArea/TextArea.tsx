import { forwardRef, HTMLAttributes, useImperativeHandle, useRef } from 'react'
import 'formElement.css'
import createClasses from 'utils/createClasses'
import Error from 'components/Error/Error'
import styles from './TextArea.module.css'

interface Props {
  placeholder?: string
  label?: string
  name: string
  value?: string
  selection?: { start: number; end: number }
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
  onSelect?: React.ReactEventHandler<HTMLTextAreaElement>
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>
  onBeforeInput?: React.FormEventHandler<HTMLTextAreaElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>
  onClick?: React.MouseEventHandler<HTMLTextAreaElement>
  error?: string
  required?: boolean
  disabled?: boolean
  borderless?: boolean
  width?: string
  height?: string
  /**
   * Directions the textarea can be resized in.
   * @default "both"
   */
  resize?: 'both' | 'horizontal' | 'vertical' | 'none'
}

export interface TextAreaRef {
  focus: () => void
}

const TextArea = forwardRef<TextAreaRef, Props>((
  {
    placeholder,
    label,
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
    disabled,
    borderless,
    width,
    height,
    resize = 'both'
  }: Props,
  ref
) => {
  useImperativeHandle(ref, () => ({
    focus() {
      textarea.current?.focus()
    }
  }))

  const textarea = useRef<HTMLTextAreaElement>(null)

  const textareaGroupClasses = createClasses({
    'form-elem': true,
    'form-elem--error': !!error
  })

  return (
    <div
      className={textareaGroupClasses}
      style={{ ...(width ? { width } : {}), ...(height ? { height: 'fit-content' } : {}) }}>
      {!!label && (
        <label
          className={'form-elem__label'}
          htmlFor={name}>
          {label}
          {required && <span className={'required-star'}>*</span>}
        </label>
      )}
      <textarea
        className={createClasses({
          'form-elem__main-control': true,
          'form-elem__main-control--borderless': !!borderless,
          'form-elem__main-control--disabled': !!disabled,
          [styles['textarea']]: true
        })}
        style={{ ...(width ? { width } : {}), ...(height ? { height } : {}), resize }}
        value={value}
        name={name}
        placeholder={placeholder}
        onBeforeInput={e => onBeforeInput && onBeforeInput(e)}
        onChange={e => onChange && onChange(e)}
        onSelect={e => onSelect && onSelect(e)}
        onFocus={e => onFocus && onFocus(e)}
        onKeyDown={e => onKeyDown && onKeyDown(e)}
        onBlur={e => onBlur && onBlur(e)}
        onClick={e => onClick && onClick(e)}
        required={required}
        disabled={disabled}
        ref={textarea}
      />
      {!!error && <Error>{error}</Error>}
    </div>
  )
})

export default TextArea
