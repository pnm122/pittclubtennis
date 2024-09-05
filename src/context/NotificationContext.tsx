import Notification from 'components/Notification/Notification'
import {
  createContext,
  PropsWithChildren,
  useRef,
  useState
} from 'react'
import styles from 'components/Notification/Notification.module.css'

export interface SingleNotification {
  /**
   * Unique identifier for the notification.
   */
  id: number
  /**
   * Type of notification to display.
   */
  type?: 'default' | 'success' | 'error'
  /**
   * Primary text for notification.
   */
  text: string
  /**
   * Optional subtext for the notification.
   */
  subtext?: string
  /**
   * Whether the notification can be dismissed by clicking a button.
   * @default false
   */
  dismissable?: boolean
  /**
   * Milliseconds until the notification disappears. A negative value means the notification stays until dismissed.
   * @default 5000
   **/
  timeout?: number
}

export type SingleNotificationWithoutId = Omit<SingleNotification, 'id'>

export interface NotificationContext {
  /**
   * Add a notification to the list of notifications
   * @param n Notification to add
   * @returns ID of the notification added
   */
  push: (n: SingleNotificationWithoutId) => number
  /**
   * Remove all notifications.
   */
  clear: () => void
  /**
   * Remove a specific notification
   * @param id ID of the notification to remove
   */
  remove: (id: number) => void
}

export const notificationContext = createContext<NotificationContext>({
  push() {
    return -1
  },
  clear() {},
  remove() {}
})

let notificationId = 0

export function NotificationContextProvider({ children }: PropsWithChildren) {
  const [notifications, setNotifications] = useState<SingleNotification[]>([])
  const notificationsContainer = useRef<HTMLDivElement>(null)

  function generateId() {
    return notificationId++
  }

  /** View transition */
  function vt(callback: () => void) {
    if (!(document as any).startViewTransition) {
      callback()
    } else {
      ;(document as any).startViewTransition(() => callback())
    }
  }

  function push(n: SingleNotificationWithoutId) {
    const id = generateId()
    vt(() => setNotifications(notifs => [...notifs, { ...n, id }]))
    return id
  }

  function clear() {}

  function remove(id: number) {
    vt(() => setNotifications(notifs => notifs.filter(n => n.id !== id)))
  }

  return (
    <notificationContext.Provider value={{ push, clear, remove }}>
      <div
        className={styles['notifications']}
        ref={notificationsContainer}>
        {notifications.map(n => (
          <Notification
            key={n.id}
            id={n.id}
            type={n.type}
            text={n.text}
            subtext={n.subtext}
            dismissable={n.dismissable}
            timeout={n.timeout}
          />
        ))}
      </div>
      {children}
    </notificationContext.Provider>
  )
}
