import createClasses from 'utils/createClasses'
import styles from './Checkbox.module.css'

interface Props {
  value: boolean | 'mixed'
  onChange: (value: boolean) => void
  label?: string
  /**
   * Should be provided if not using the label.
   */
  ariaLabel?: string
  /**
   * Call stopPropagation on click.
   */
  stopPropagation?: boolean
  disabled?: boolean
}

export default function Checkbox({
  value,
  onChange,
  label,
  ariaLabel,
  stopPropagation,
  disabled
}: Props) {
  function handleChange(e: React.MouseEvent | React.KeyboardEvent) {
    e.preventDefault()
    if(stopPropagation) {
      e.stopPropagation()
    }
    if(!value || value === 'mixed') {
      onChange(true)
    } else {
      onChange(false)
    }
  }
  
  return (
    <div className={createClasses({
      [styles['checkbox']]: true,
      [styles['checkbox--disabled']]: !!disabled
    })}>
      <div className='with-hover-circle'>
        <div
          role='checkbox'
          aria-disabled={disabled}
          aria-checked={value}
          aria-label={ariaLabel}
          tabIndex={0}
          onClick={e => !disabled && handleChange(e)}
          onKeyDown={e =>
            (e.key === 'Enter' || e.key === ' ') && !disabled && handleChange(e)
          }
        />
      </div>
      {label && (
        <label
          onClick={e => !disabled && handleChange(e)}
          className={styles['checkbox__label']}>
          {label}
        </label>
      )}
    </div>
  )
}
