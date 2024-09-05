import styles from './Drawer.module.css'

export default function DrawerContent({ children }: React.PropsWithChildren) {
  return <div className={styles['drawer-content']}>{children}</div>
}
