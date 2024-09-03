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
}

export default function Checkbox({
  value,
  onChange,
  label,
  ariaLabel,
  stopPropagation
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
    <div className={styles['checkbox']}>
      <div className='with-hover-circle'>
        <div
          role='checkbox'
          aria-checked={value}
          aria-label={ariaLabel}
          tabIndex={0}
          onClick={handleChange}
          onKeyDown={e =>
            (e.key === 'Enter' || e.key === ' ') && handleChange(e)
          }
        />
      </div>
      {label && (
        <label
          onClick={handleChange}
          className={styles['checkbox__label']}>
          {label}
        </label>
      )}
    </div>
  )
}
