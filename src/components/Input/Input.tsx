import { ChangeEventHandler } from 'react'
import styles from './Input.module.css'
import createClasses from 'utils/createClasses'

interface Props {
  placeholder?: string
  label?: string
  type?: React.InputHTMLAttributes<HTMLInputElement>['type']
  name: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  error?: string
  required?: boolean
}

export default function Input({
  placeholder,
  label,
  type,
  name,
  value,
  onChange,
  error,
  required
}: Props) {
  const inputGroupClasses = createClasses({
    [styles['input-group']]: true,
    [styles['input-group--error']]: !!error
  })

  return (
    <div className={inputGroupClasses}>
      {!!label && (
        <label className={styles['input-group__label']} htmlFor={name}>
          {label}
          {required && <span className={styles['required-star']}>*</span>}
        </label>
      )}
      <input 
        className={styles['input-group__input']}
        value={value} 
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
      />
      {!!error && <span className={styles['input-group__error']}>{error}</span>}
    </div>
  )
}
