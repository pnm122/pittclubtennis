import { Link } from 'react-router-dom'
import styles from './AnimatedButton.module.css'
import createClasses from 'utils/createClasses'

interface Props {
  type?: 'link' | 'button'
  size?: 'small' | 'medium' | 'large'
  style?: 'primary' | 'secondary' | 'ghost'
  href?: string
  id?: string
  className?: string
  text: string
  beforeText?: React.ReactNode
  afterText?: React.ReactNode
  disabled?: boolean
  newTab?: boolean
  onClick?: (e: React.MouseEvent) => void
}

export default function AnimatedButton({
  type = 'link',
  size = 'medium',
  style = 'primary',
  href,
  text,
  beforeText,
  afterText,
  id,
  className,
  disabled,
  newTab,
  onClick
} : Props) {
  const classes = createClasses({
    [styles['link']]: true,
    [styles[`link--${size}`]]: true,
    [styles[`link--${style}`]]: true,
    ...(Object.fromEntries((className ?? '').split(' ').map(c => [c, true])))
  })

  return type === 'link' ? (
    <Link 
      to={href ?? '#'}
      id={id}
      aria-disabled={disabled}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      onClick={(e) => !disabled && onClick && onClick(e)}
      className={classes}>
        {beforeText}
        <span 
          className={styles['link-inner']}
          data-text={text}>
          {text}
        </span>
        {afterText}
      </Link>
  ) : (
    <button
      id={id}
      aria-disabled={disabled}
      onClick={(e) => !disabled && onClick && onClick(e)}
      className={classes}>
      {beforeText}
      <span 
        className={styles['link-inner']}
        data-text={text}>
        {text}
      </span>
      {afterText}
    </button>
  )
}

