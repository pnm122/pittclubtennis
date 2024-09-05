import Checkbox from 'components/Checkbox/Checkbox'
import styles from './Tryouts.module.css'
import { useContext, useEffect, useState } from 'react'
import Input from 'components/Input/Input'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import getTryoutsInfo from 'utils/firebase/getTryoutsInfo'
import TryoutsType from 'types/TryoutsType'
import { notificationContext } from 'context/NotificationContext'
import Loader from 'components/Loader/Loader'
import { DocumentSnapshot, updateDoc } from 'firebase/firestore'

export default function Tryouts() {
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tryouts, setTryouts] = useState<{
    data: TryoutsType
    doc: DocumentSnapshot
  } | null>(null)
  const { push: pushNotification } = useContext(notificationContext)

  useEffect(() => {
    fetchTryouts()
  }, [])

  async function fetchTryouts() {
    setIsLoading(true)
    const t = await getTryoutsInfo()
    setIsLoading(false)

    if (t.error) {
      return pushNotification({
        type: 'error',
        text: 'There was an error retrieving tryouts information.',
        subtext: `Error code: ${t.error.code}`,
        timeout: -1,
        dismissable: true
      })
    }

    setTryouts(t.data)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateDoc(tryouts!.doc.ref, tryouts!.data)
      pushNotification({
        type: 'success',
        text: 'Successfully updated tryouts information!'
      })
      fetchTryouts()
    } catch (e) {
      pushNotification({
        type: 'error',
        text: 'There was an error updating tryouts.',
        subtext: (e as any).toString(),
        timeout: -1,
        dismissable: true
      })
    }
    setIsSaving(false)
  }

  return (
    <div className='container admin-page'>
      <h1 className='admin-page__title'>Tryouts</h1>
      {isLoading || !tryouts ? (
        <Loader size={32} />
      ) : (
        <form
          className={styles['form']}
          onSubmit={save}>
          <Checkbox
            value={tryouts.data.open}
            onChange={value =>
              setTryouts({ ...tryouts, data: { ...tryouts.data, open: value } })
            }
            label='Open Tryouts'
          />
          <div className={styles['input-group']}>
            <Input
              name='link'
              value={tryouts.data.link}
              onChange={e =>
                setTryouts({
                  ...tryouts,
                  data: { ...tryouts.data, link: e.target.value }
                })
              }
              label='Link'
              type='url'
              disabled={!tryouts.data.open}
              width='100%'
            />
            {!tryouts.data.open && (
              <p className={styles['input-group__helper']}>
                Open tryouts to edit the link.
              </p>
            )}
          </div>
          <AnimatedButton
            text='Save'
            type='button'
            loading={isSaving}
            submit
          />
        </form>
      )}
    </div>
  )
}
