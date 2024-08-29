import createClasses from 'utils/createClasses'
import css from './Drawer.module.css'

interface Props {
  orientation: 'top' | 'bottom' | 'left' | 'right'
  open: boolean
  style?: 'default' | 'detached'
  size?: number
  hasBackdrop?: boolean
  onBackdropClicked?: () => void
  styles?: React.CSSProperties
  className?: string
  backdropStyles?: React.CSSProperties
  backdropClassName?: string
}

export default function Drawer({
  orientation,
  open,
  style = 'default',
  size,
  hasBackdrop = true,
  onBackdropClicked,
  styles,
  className,
  backdropStyles,
  backdropClassName,
  children
}: React.PropsWithChildren<Props>) {
  const drawerClasses = createClasses({
    [css['drawer']]: true,
    [css[`drawer--${orientation}`]]: true,
    [css['drawer--open']]: open,
    [css['drawer--detached']]: style === 'detached',
    ...(className ? { [className]: true } : {})
  })

  const backdropClasses = createClasses({
    [css['drawer-backdrop']]: true,
    [css['drawer-backdrop--open']]: open,
    ...(backdropClassName ? { [backdropClassName]: true } : {})
  })

  return (
    <>
      {hasBackdrop && (
        <div
          onClick={() => onBackdropClicked && onBackdropClicked()}
          className={backdropClasses}
          style={{
            zIndex: 998,
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            ...backdropStyles
          }}
        />
      )}
      <div
        role="dialog"
        className={drawerClasses}
        style={{
          zIndex: 999,
          backgroundColor: 'var(--bg)',
          width: ['left', 'right'].includes(orientation) && size ? `${size}px` : undefined,
          height: ['top', 'bottom'].includes(orientation) && size ? `${size}px` : undefined,
          ...styles
        }}>
        {children}
      </div>
    </>
  )
}
