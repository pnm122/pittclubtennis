import createClasses from 'utils/createClasses'
import css from './Popup.module.css'

interface Props {
  open: boolean
  hasBackdrop?: boolean
  onBackdropClicked?: () => void
  backdropStyles?: React.CSSProperties
  backdropClassName?: string
}

export default function Popup({
  open,
  hasBackdrop = true,
  onBackdropClicked,
  backdropStyles,
  backdropClassName,
  children
}: React.PropsWithChildren<Props>) {
  const drawerClasses = createClasses({
    [css['popup']]: true,
    [css['popup--open']]: open
  })

  const backdropClasses = createClasses({
    [css['popup-backdrop']]: true,
    [css['popup-backdrop--open']]: open,
    ...(backdropClassName ? { [backdropClassName]: true } : {})
  })
  return (
    <>
      {hasBackdrop && (
        <div
          onClick={() => onBackdropClicked && onBackdropClicked()}
          className={backdropClasses}
          style={{
            zIndex: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            ...backdropStyles
          }}
        />
      )}
      <div
        role='dialog'
        className={drawerClasses}
        style={{
          zIndex: 1000
        }}>
        {children}
      </div>
    </>
  )
}
