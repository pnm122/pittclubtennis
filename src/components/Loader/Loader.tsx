import styles from './Loader.module.css'

interface Props {
  size: number
  bgColor?: string
  color?: string
  innerColor?: string
}

export default function Loader({ size, bgColor, color, innerColor } : Props) {
  return (
    <div 
    id={styles['loader']} 
    style={{ 
      '--size': `${size}px`,
      '--bgColor': bgColor ?? 'var(--primary25)',
      '--color': color ?? 'var(--primary)',
      '--innerColor': innerColor ?? 'white',
    } as React.CSSProperties}>
      <div id={styles['loader-inner']} />
    </div>
  )
}
