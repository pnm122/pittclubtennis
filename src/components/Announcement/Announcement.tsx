import getAnnouncement from 'utils/firebase/getAnnouncement'
import styles from './Announcement.module.css'
import { useEffect, useState } from 'react'
import AnnouncementType from 'types/AnnouncementType'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'

export default function Announcement() {
  const [notif, setNotif] = useState<AnnouncementType | null>(null)
  const [showing, setShowing] = useState(false)

  useEffect(() => {
    getAnnouncement().then(res => {
      if (res.error || !res.data) {
        return
      }

      setNotif(res.data)
      setShowing(true)
    })
  }, [])

  return (
    <div
      id={styles['notif-outer']}
      aria-hidden={!showing}>
      <div className='container'>
        {notif && notif.active ? (
          <div id={styles['notif']}>
            <div id={styles['notif-content']}>
              <h3>{notif.title}</h3>
              <p>{notif.message}</p>
            </div>
            <div id={styles['buttons']}>
              <AnimatedButton
                href={notif.link}
                text={notif.linkTitle}
                newTab={notif.linkNewTab}
                onClick={() => setShowing(false)}
              />
              <button
                onClick={() => setShowing(false)}
                id={styles['hide-button']}>
                Hide
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
