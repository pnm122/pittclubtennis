import {
  notificationContext,
  NotificationContext,
  SingleNotification
} from 'context/NotificationContext'
import styles from './Notification.module.css'
import { useContext, useEffect, useState } from 'react'
import createClasses from 'utils/createClasses'
import { MdWarning } from 'react-icons/md'
import { MdError } from 'react-icons/md'
import { IoCheckmarkCircleSharp } from 'react-icons/io5'
import { MdClose } from 'react-icons/md'

export default function Notification({
  timeout = 5000,
  text,
  subtext,
  id,
  type = 'default',
  dismissable
}: SingleNotification) {
  const { remove } = useContext<NotificationContext>(notificationContext)

  useEffect(() => {
    if (timeout < 0) return

    const t = setTimeout(() => {
      remove(id)
    }, timeout)

    return () => {
      clearTimeout(t)
    }
  }, [])

  return (
    <div
      style={{
        viewTransitionName: `notification-${id}`
      }}
      className={createClasses({
        [styles['notification']]: true,
        [styles[`notification--${type}`]]: true
      })}>
      <div className={styles['notification__inner']}>
        {type === 'error' && <MdError />}
        {type === 'default' && <MdWarning />}
        {type === 'success' && <IoCheckmarkCircleSharp />}
        <div className={styles['notification__text']}>
          <span className={styles['text']}>{text}</span>
          <span className={styles['subtext']}>{subtext}</span>
        </div>
      </div>
      {dismissable && (
        <button
          className={createClasses({
            [styles['notification__close']]: true,
            'with-hover-circle': true
          })}
          onClick={() => remove(id)}>
          <MdClose />
        </button>
      )}
    </div>
  )
}
