import styles from './Loader.module.css'

interface Props {
  size: number
  color?: string
}

export default function Loader({ size, color = 'var(--primary)' } : Props) {
  return (
    <svg
      style={{ 
        '--size': `${size}px`,
      } as React.CSSProperties}
      className={styles['loader']}
      viewBox="0 0 225 225"
      xmlns="http://www.w3.org/2000/svg">
      <circle cx="112.5" cy="112.5" fill="none"
        r="100" stroke-width="25" stroke={color}
      />
    </svg>
  )
}
