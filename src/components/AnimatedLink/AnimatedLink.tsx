import { Link } from 'react-router-dom'
import styles from './AnimatedLink.module.css'

interface Props {
  to: string
  className?: string
  id?: string
  text: string
  disabled?: boolean
  newTab?: boolean
  onClick?: () => void
}

type P = React.PropsWithChildren<Props>

export default function AnimatedLink({ to, text, className, id, disabled, newTab, onClick, children } : P) {
  return (
    <Link 
      to={to}
      id={id}
      aria-disabled={disabled}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className={`${className} ${styles['link']}`}>
        <span 
          className={styles['link-inner']}
          data-text={text}>
          {text}
        </span>
        {children}
      </Link>
  )
}

