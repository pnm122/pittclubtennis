import { useContext, useEffect, useState } from 'react'
import styles from './Announcement.module.css'
import { DocumentSnapshot } from 'firebase/firestore'
import AnnouncementType from 'types/AnnouncementType'
import Loader from 'components/Loader/Loader'
import getAnnouncement from 'utils/firebase/getAnnouncement'
import { notificationContext } from 'context/NotificationContext'
import Checkbox from 'components/Checkbox/Checkbox'
import Input from 'components/Input/Input'
import TextArea from 'components/TextArea/TextArea'
import { AnnouncementComponent } from 'components/Announcement/Announcement'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'

export default function Announcement() {
  const [announcement, setAnnouncement] = useState<{ data: AnnouncementType, doc: DocumentSnapshot } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { push: pushNotification } = useContext(notificationContext)

  useEffect(() => {
    fetchAnnouncement()
  }, [])

  async function fetchAnnouncement() {
    setIsLoading(true)
    const a = await getAnnouncement()
    setIsLoading(false)

    if(a.error) {
      return pushNotification({
        type: 'error',
        text: 'There was an error retrieving the announcement.',
        subtext: `Error code: ${a.error.code}`,
        timeout: -1,
        dismissable: true
      })
    }

    setAnnouncement(a.data)
  }

  function setState(type: keyof AnnouncementType, value: AnnouncementType[keyof AnnouncementType]) {
    setAnnouncement(a => a ? ({
      ...a,
      data: {
        ...a.data,
        [type]: value
      }
    }) : a)
  }

  return (
    <div className='container'>
      <h1 className='admin-page-title'>Announcement</h1>
      {isLoading || !announcement ? (
        <Loader
          size={32}
        />
      ) : (
        <>
          <form className={styles['form']}>
            <Checkbox
              value={announcement.data.active}
              onChange={value => setState('active', value)}
              label='Enable announcement'
            />
            <hr className={styles['divider']}></hr>
            <div className={styles['form__section']}>
              <h2 className={styles['form__heading']}>Content</h2>
              <Input
                name='title'
                label='Title'
                value={announcement.data.title}
                onChange={e => setState('title', e.target.value)}
                disabled={!announcement.data.active}
                required={announcement.data.active}
              />
              <TextArea
                name='message'
                label='Message'
                value={announcement.data.message}
                onChange={e => setState('message', e.target.value)}
                resize='vertical'
                height='150px'
                disabled={!announcement.data.active}
                required={announcement.data.active}
              />
            </div>
            <hr className={styles['divider']}></hr>
            <div className={styles['form__section']}>
              <h2 className={styles['form__heading']}>Link</h2>
              <Input
                name='link-title'
                label='Link Title'
                value={announcement.data.linkTitle}
                onChange={e => setState('linkTitle', e.target.value)}
                disabled={!announcement.data.active}
                required={announcement.data.active}
              />
              <Input
                name='link'
                label='Link'
                type='url'
                value={announcement.data.link}
                onChange={e => setState('link', e.target.value)}
                disabled={!announcement.data.active}
                required={announcement.data.active}
              />
              <Checkbox
                value={announcement.data.linkNewTab}
                onChange={value => setState('linkNewTab', value)}
                label='Open link in new tab'
                disabled={!announcement.data.active}
              />
            </div>
            <hr className={styles['divider']}></hr>
            {announcement.data.active && (
              <>
                <div className={`${styles['form__section']} ${styles['preview']}`}>
                  <h2 className={styles['form__heading']}>Preview</h2>
                  <AnnouncementComponent
                    announcement={announcement.data}
                    preview
                  />
                </div>
                <hr className={styles['divider']}></hr>
              </>
            )}
            <AnimatedButton
              text='Save'
            />
          </form>
        </>
      )}
    </div>
  )
}
