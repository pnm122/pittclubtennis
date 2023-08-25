import getNotification from 'utils/firebase/getNotification'
import styles from './Notification.module.css'
import { useEffect, useState } from 'react'
import NotificationType from 'types/NotificationType'
import AnimatedLink from 'components/AnimatedLink/AnimatedLink'

export default function Notification() {
  const [notif, setNotif] = useState<NotificationType | null>(null)
  const [showing, setShowing] = useState(false)

  useEffect(() => {
    getNotification().then(res => {
      if(res.error || !res.data) {
        return
      }

      setNotif(res.data)
      setShowing(true)
    })
  }, [])

  return (
    <div id={styles['notif-outer']} aria-hidden={!showing}>
      <div className='container'>
        {notif ? (
          <div id={styles['notif']}>
            <div id={styles['notif-content']}>
              <h3>{notif.title}</h3>
              <p>{notif.message}</p>
            </div>
            <div id={styles['buttons']}>
              <AnimatedLink 
                to={notif.link} 
                text={notif.linkTitle}
                newTab={notif.linkNewTab}
                onClick={() => setShowing(false)}
                className='primary-button'
              />
              <button 
                onClick={() => setShowing(false)}
                id={styles['hide-button']}>Hide</button>
            </div>
          </div>
        ) : <></>}
      </div>
    </div>
  )
}
