import styles from './Skeleton.module.css'

export default function Skeleton({ width, height, aspectRatio, backgroundColor, shineColor, borderRadius } : SkeletonType) {
  return (
    <div 
      className={styles.skeleton}
      style={{ 
        width: width, 
        height: height,
        aspectRatio: aspectRatio,
        backgroundColor: backgroundColor ? backgroundColor : 'var(--on-bg10)',
        "--shine-color": shineColor ? shineColor : "white",
        borderRadius: borderRadius ?? "var(--rounding)"
      } as React.CSSProperties}
    />
  )
}
