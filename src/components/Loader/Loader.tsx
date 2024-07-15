import styles from './Loader.module.css'

interface Props {
  size: number
  style?: 'default' | 'on-primary' | 'on-secondary'
}

export default function Loader({ size, style = 'default' } : Props) {
  const { bgColor, color, innerColor } =
    style === 'default' ? {
      bgColor: 'var(--primary)',
      color: 'var(--primary)',
      innerColor: 'var(--bg)'
    } : style === 'on-primary' ? {
      bgColor: 'var(--primary)',
      color: 'var(--bg)',
      innerColor: 'var(--primary)'
    } : {
      bgColor: 'var(--secondary75)',
      color: 'var(--primary)',
      innerColor: 'var(--secondary)'
    }
  
  return (
    <div 
    id={styles['loader']} 
    style={{ 
      '--size': `${size}px`,
      '--bgColor': bgColor,
      '--color': color,
      '--innerColor': innerColor,
    } as React.CSSProperties}>
      <div id={styles['loader-inner']} />
    </div>
  )
}
