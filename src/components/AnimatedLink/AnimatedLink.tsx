import { Link } from 'react-router-dom'
import styles from './AnimatedLink.module.css'
import { useLayoutEffect, useRef } from 'react'

interface Props {
  to: string
  className?: string
  id?: string
  text: string
}

type P = React.PropsWithChildren<Props>

export default function AnimatedLink({ to, text, className, id, children } : P) {
  return (
    <Link 
      to={to}
      id={id}
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

