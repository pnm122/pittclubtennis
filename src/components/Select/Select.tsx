import createClasses from 'utils/createClasses'
import styles from './Select.module.css'
import { useRef, useState } from 'react'
import { MdKeyboardArrowUp } from 'react-icons/md'
import Error from 'components/Error/Error'

interface Props {
  /** Optional label for the select. */
  label?: string
  /** Selectable values. Optional name can be provided, which will sent on change instead. */
  options: { value: string, name?: string }[]
  /** Index or item currently selected */
  value?: string | number
  /** Callback fired when an item is selected */
  onChange: ({ index, selected }: { index: number, selected: string }) => void
  /** Placeholder for the select. By default, it says "Select" */
  placeholder?: string
  /** Error to show for the select */
  error?: string
  /** Width of the select. Also used by the popup unless 'popupHugContents' is true */
  width?: string
  /** Whether the popup should hug its contents or match the width of the select control. Defaults to false. */
  popupHugContents?: boolean
}

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select',
  error,
  width,
  popupHugContents = false
}: Props) {
  const current = useRef<HTMLDivElement>(null)
  const popup = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const renderOptions = options.map(o => ({ value: o.value, name: o.name ?? o.value }))
  const renderValue =
    typeof value === 'number'
      ? renderOptions[value]
      : renderOptions.find(o => o.name === value)

  const handleChange = (value: { index: number, selected: string }) => {
    setOpen(false)
    onChange(value)
    current.current?.focus()
  }

  const getOptionElement = (index: number) => (
    popup.current?.getElementsByClassName(styles['option__button']).item(index) as HTMLElement
  )

  const onCurrentKeyDown = async (e: React.KeyboardEvent) => {
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(o => !o)
    }
  }

  return (
    <div
      className={createClasses({
        [styles['select']]: true,
        [styles['select--error']]: !!error
      })}
      style={{...(width ? { width }: {})}}>
      {label && <label htmlFor={`select-${label}`} className={styles['select__label']}>{label}</label>}
      <div className={styles['select__inner']}>
        <div
          ref={current}
          id={label ? `select-${label}` : undefined}
          className={styles['select__current']}
          onClick={() => setOpen(!open)}
          onKeyDown={(e) => onCurrentKeyDown(e)}
          role='button'
          tabIndex={0}
          aria-haspopup='listbox'
          aria-pressed={open}
          aria-description='Open select options popup'>
          <span className={styles['current-value']}>{renderValue?.name ?? placeholder}</span>
          <MdKeyboardArrowUp className={createClasses({
            [styles['select__arrow']]: true,
            [styles['select__arrow--flipped']]: open
          })} />
        </div>
        <div
          ref={popup}
          className={createClasses({
            [styles['select__popup']]: true,
            [styles['select__popup--open']]: open,
            [styles['select__popup--hug-contents']]: popupHugContents
          })}>
          <ul className={styles['option-list']}>
            {renderOptions.map((o, index) => (
              <li className={styles['option']} key={o.name}>
                <button
                  className={createClasses({
                    [styles['option__button']]: true,
                    [styles['option__button--selected']]: renderValue?.name === o.name
                  })}
                  onClick={() => handleChange({ index, selected: o.name })}>
                  {o.value}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {error && <Error>{error}</Error>}
    </div>
  )
}
