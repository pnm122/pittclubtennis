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

      setNotif(res.data.data)
      setShowing(true)
    })
  }, [])

  return (
    <div
      id={styles['notif-outer']}
      aria-hidden={!showing}>
      <div className='container'>
        {notif && notif.active ? (
          <AnnouncementComponent
            announcement={notif}
            setShowing={setShowing}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

interface AnnouncementComponentProps {
  announcement: AnnouncementType
  setShowing?: (s: boolean) => void
  preview?: boolean
}

export function AnnouncementComponent({
  announcement,
  setShowing,
  preview
}: AnnouncementComponentProps) {
  return (
    <div id={styles['notif']}>
      <div id={styles['notif-content']}>
        <h3>{announcement.title}</h3>
        <p>{announcement.message}</p>
      </div>
      <div id={styles['buttons']}>
        <AnimatedButton
          href={announcement.link}
          text={announcement.linkTitle}
          // Automatically open in new tab in preview mode so that changes aren't lost
          newTab={preview || announcement.linkNewTab}
          onClick={() => setShowing && setShowing(false)}
        />
        <button
          onClick={() => setShowing && setShowing(false)}
          type='button'
          id={styles['hide-button']}>
          Hide
        </button>
      </div>
    </div>
  )
}