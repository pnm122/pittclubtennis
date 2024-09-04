import createClasses from 'utils/createClasses'
import styles from './Select.module.css'
import 'formElement.css'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { MdKeyboardArrowUp } from 'react-icons/md'
import Error from 'components/Error/Error'
import generateId from 'utils/generateId'

interface Props {
  /** Optional label for the select. */
  label?: string
  /** Selectable values. Optional value can be provided, which will sent on change instead of the name, which is displayed to the user. */
  options: readonly (string | { value: any; name: string })[]
  /** Item currently selected. If providing both a name and value for the selected option, this must be the value of that option. */
  value?: string | number | null
  /** Callback fired when an item is selected */
  onChange: (selected: any) => void
  /** Placeholder for the select. By default, it says "Select" */
  placeholder?: string
  /** Error to show for the select */
  error?: string
  /** Width of the select. Also used by the popup unless 'popupHugContents' is true */
  width?: string
  /** Whether the popup should hug its contents or match the width of the select control. Defaults to false. */
  popupHugContents?: boolean
  /**
   * Whether the select is required.
   */
  required?: boolean
}

export interface SelectRef {
  focus: () => void
}

const Select = forwardRef<SelectRef, Props>(function Select(
  {
    label,
    options,
    value,
    onChange,
    placeholder = 'Select',
    error,
    width,
    popupHugContents = false,
    required
  }: Props,
  ref
) {
  useImperativeHandle(ref, () => ({
    focus
  }))

  const id = useRef(generateId())
  const current = useRef<HTMLDivElement>(null)
  const popup = useRef<HTMLDivElement>(null)
  const optionElements = useRef<{ [index: number]: HTMLButtonElement | null }>(
    {}
  )
  const [open, setOpen] = useState(false)
  const [focusIndex, setFocusIndex] = useState<number | null>(null)

  const renderOptions = options.map(o =>
    typeof o === 'string'
      ? { value: o, name: o }
      : { value: o.value, name: o.name ?? o.value }
  )
  const renderValue = renderOptions.find(o => o.value === value)

  const focus = () => {
    current.current?.focus()
  }

  useEffect(() => {
    if (!open) setFocusIndex(-1)
  }, [open])

  const focusOption = (index: number) => {
    setFocusIndex(index)
    optionElements.current[index]?.focus()
  }

  const handleChange = (value: { index: number; selected: any }) => {
    setOpen(false)
    onChange(value)
    current.current?.focus()
  }

  const getSelectedIndex = () => {
    return renderValue
      ? renderOptions.findIndex(o => o.name === renderValue.name)
      : -1
  }

  const onCurrentKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(o => !o)
    } else if (
      (e.key === 'ArrowDown' && renderOptions.length > 0) ||
      (e.key === 'Tab' && !e.shiftKey && open)
    ) {
      e.preventDefault()
      const selectedIndex = getSelectedIndex()
      focusOption(selectedIndex === -1 ? 0 : selectedIndex)
    }
  }

  const onBlur = (e: React.FocusEvent) => {
    const { relatedTarget } = e
    const inSelect = relatedTarget?.closest(`#${id.current}`)
    if (!inSelect) {
      setOpen(false)
    }
  }

  const onPopupKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
      focus()
    } else if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
      e.preventDefault()
      const nextIndex =
        focusIndex === null ? 0 : (focusIndex + 1) % renderOptions.length
      focusOption(nextIndex)
    } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
      e.preventDefault()
      const nextIndex =
        focusIndex === null
          ? 0
          : focusIndex > 0
            ? focusIndex - 1
            : renderOptions.length - 1
      focusOption(nextIndex)
    }
  }

  return (
    <div
      id={id.current}
      className={createClasses({
        'form-elem': true,
        'form-elem--error': !!error
      })}
      onBlur={onBlur}
      style={{ ...(width ? { width } : {}) }}>
      {!!label && (
        <label className={'form-elem__label'}>
          {label}
          {required && <span className={'required-star'}>*</span>}
        </label>
      )}
      <div className={styles['select__inner']}>
        <div
          ref={current}
          id={label ? `select-${label}` : undefined}
          className={createClasses({
            [styles['select__current']]: true,
            'form-elem__main-control': true
          })}
          onClick={() => setOpen(!open)}
          onKeyDown={e => onCurrentKeyDown(e)}
          role='button'
          tabIndex={0}
          aria-haspopup='listbox'
          aria-pressed={open}
          aria-description='Open select options popup'>
          <span
            className={createClasses({
              [styles['current-value']]: !!renderValue?.name,
              'main-control__placeholder': !renderValue?.name
            })}>
            {renderValue?.name ?? placeholder}
          </span>
          <MdKeyboardArrowUp
            className={createClasses({
              [styles['select__arrow']]: true,
              [styles['select__arrow--flipped']]: open
            })}
          />
        </div>
        <div
          ref={popup}
          role='dialog'
          className={createClasses({
            [styles['select__popup']]: true,
            [styles['select__popup--open']]: open,
            [styles['select__popup--hug-contents']]: popupHugContents
          })}
          onKeyDown={onPopupKeyDown}>
          <ul className={styles['option-list']}>
            {renderOptions.map((o, index) => (
              <li
                className={styles['option']}
                key={o.value ?? o.name}>
                <button
                  type='button'
                  className={createClasses({
                    [styles['option__button']]: true,
                    [styles['option__button--selected']]:
                      renderValue?.value === o.value
                  })}
                  onClick={() => handleChange(o.value)}
                  ref={el => (optionElements.current[index] = el)}>
                  {o.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {error && <Error>{error}</Error>}
    </div>
  )
})

export default Select
