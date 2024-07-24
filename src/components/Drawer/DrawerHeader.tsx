import { MdClose } from "react-icons/md";
import createClasses from "utils/createClasses";
import styles from './Drawer.module.css'

interface Props {
  title?: string
  className?: string
  onClose: () => void
}

export default function DrawerHeader({
  title,
  className,
  onClose
}: Props) {
  const headerClasses = createClasses({
    [styles['drawer-header']]: true,
    ...(className ? { [className]: true } : {})
  })

  return (
    <div className={headerClasses}>
      <h1 className={styles["drawer-header__title"]}>{title}</h1>
      <button
        className={styles["drawer-header__close"]}
        onClick={() => onClose && onClose()}>
        <MdClose />
      </button>
    </div>
  )
}
