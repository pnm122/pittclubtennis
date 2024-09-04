import React, { useContext, useEffect, useState } from 'react'
import styles from './Announcement.module.css'
import { DocumentSnapshot, updateDoc } from 'firebase/firestore'
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
  type Errors = {
    [key in keyof Omit<AnnouncementType, 'active' | 'linkNewTab'>]: string
  }

  const noErrors = {
    title: '',
    message: '',
    linkTitle: '',
    link: ''
  }

  const [announcement, setAnnouncement] = useState<{
    data: AnnouncementType
    doc: DocumentSnapshot
  } | null>(null)
  const [errors, setErrors] = useState<Errors>(noErrors)
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

    if (a.error) {
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

  function setState(
    type: keyof AnnouncementType,
    value: AnnouncementType[keyof AnnouncementType]
  ) {
    // Clear error on changed state
    setErrors(e => ({
      ...e,
      [type]: ''
    }))
    setAnnouncement(a =>
      a
        ? {
            ...a,
            data: {
              ...a.data,
              [type]: value
            }
          }
        : a
    )
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()

    if(!announcement) return

    const { title, message, link, linkTitle, active } = announcement.data
    const errorMessage = 'This field is required.'

    // Probably handled by browser by default, but should be here in case
    if(active) {
      setErrors({
        title: title === '' ? errorMessage : '',
        message: message === '' ? errorMessage : '',
        link: link === '' ? errorMessage : '',
        linkTitle: linkTitle === '' ? errorMessage : ''
      })
      const hasError = title === '' || message === '' || link === '' || linkTitle === ''
      if(hasError) {
        return pushNotification({
          text: 'Please fill out all required fields.'
        })
      }
    }

    setErrors(noErrors)
    setIsSaving(true)
    try {
      await updateDoc(announcement.doc.ref, announcement.data as any)
      pushNotification({
        type: 'success',
        text: 'Successfully updated the announcement!'
      })
      fetchAnnouncement()
    } catch (e) {
      pushNotification({
        type: 'error',
        text: 'There was an error updating the announcement.',
        subtext: (e as any).toString(),
        timeout: -1,
        dismissable: true
      })
    }
    setIsSaving(false)
  }

  return (
    <div className='container'>
      <h1 className='admin-page-title'>Announcement</h1>
      {isLoading || !announcement ? (
        <Loader size={32} />
      ) : (
        <>
          <form className={styles['form']} onSubmit={save}>
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
                error={!announcement.data.active ? '' : errors.title}
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
                error={!announcement.data.active ? '' : errors.message}
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
                error={!announcement.data.active ? '' : errors.linkTitle}
              />
              <Input
                name='link'
                label='Link'
                type='url'
                value={announcement.data.link}
                onChange={e => setState('link', e.target.value)}
                disabled={!announcement.data.active}
                required={announcement.data.active}
                error={!announcement.data.active ? '' : errors.link}
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
                <div
                  className={`${styles['form__section']} ${styles['preview']}`}>
                  <h2 className={styles['form__heading']}>Preview</h2>
                  <AnnouncementComponent
                    announcement={announcement.data}
                    preview
                  />
                </div>
                <hr className={styles['divider']}></hr>
              </>
            )}
            <AnimatedButton text='Save' type='button' loading={isSaving} submit />
          </form>
        </>
      )}
    </div>
  )
}
