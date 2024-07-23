import { Link } from 'react-router-dom'
import styles from './AnimatedButton.module.css'
import createClasses from 'utils/createClasses'
import Loader from 'components/Loader/Loader'

interface Props {
  type?: 'link' | 'button'
  size?: 'small' | 'medium' | 'large'
  style?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'positive' | 'negative'
  href?: string
  id?: string
  className?: string
  text: string
  beforeText?: React.ReactNode
  afterText?: React.ReactNode
  disabled?: boolean
  newTab?: boolean
  fullWidth?: boolean
  loading?: boolean
  submit?: boolean
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
  fullWidth,
  loading,
  submit,
  onClick
} : Props) {
  const classes = createClasses({
    [styles['link']]: true,
    [styles[`link--${size}`]]: true,
    [styles[`link--${style}`]]: true,
    [styles['link--full-width']]: !!fullWidth,
    [styles['link--loading']]: !!loading,
    ...(Object.fromEntries((className ?? '').split(' ').map(c => [c, true])))
  })

  const innerJSX = loading ? (
    <Loader
      size={size === 'small' ? 16 : size === 'medium' ? 18 : 24}
      style={style === 'primary' ? 'on-primary' : style === 'secondary' ? 'on-secondary' : 'default'}
    />
  ) : (
    <>
      {beforeText}
        <span
          className={styles['link__inner']}
          data-text={text}>
          {text}
        </span>
      {afterText}
    </>
  )

  return type === 'link' ? (
    <Link 
      to={href ?? '#'}
      id={id}
      aria-disabled={disabled}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      onClick={(e) => !disabled && !loading && onClick && onClick(e)}
      className={classes}>
      {innerJSX}
    </Link>
  ) : (
    <button
      type={submit ? 'submit' : undefined}
      id={id}
      aria-disabled={disabled}
      onClick={(e) => !disabled && !loading && onClick && onClick(e)}
      className={classes}>
      {innerJSX}
    </button>
  )
}

