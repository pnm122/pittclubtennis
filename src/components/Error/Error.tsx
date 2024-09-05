import { PropsWithChildren } from 'react'
import { MdError } from 'react-icons/md'
import styles from './Error.module.css'
import createClasses from 'utils/createClasses'

interface Props {
  size?: 'small' | 'medium' | 'large'
}

export default function Error({
  size = 'small',
  children
}: PropsWithChildren<Props>) {
  return (
    <span
      className={createClasses({
        [styles['error']]: true,
        [styles[`error--${size}`]]: true
      })}>
      <MdError className={styles['error__icon']} />
      <span className={styles['error__inner']}>{children}</span>
    </span>
  )
}
