import Popup from 'components/Popup/Popup'
import styles from './EditWarningPopup.module.css'
import { MdWarning } from 'react-icons/md'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'

interface Props {
  open: boolean
  close: (deleteProgress: boolean) => void
}

export default function EditWarningPopup({
  open,
  close
}: Props) {
  return (
    <Popup open={open}>
      <div className={styles['popup']}>
        <div className={styles['popup__warning-label']}>
          <MdWarning />
          <span>Warning</span>
        </div>
        <div className={styles['popup__body']}>
          <h1 className={styles['popup__title']}>
            You have unsaved changes!
          </h1>
          <p>
            Are you sure you want to cancel editing? This action cannot be
            undone.
          </p>
          <div className={styles['popup__actions']}>
            <AnimatedButton
              text='Delete changes'
              style='negative'
              onClick={() => close(true)}
            />
            <AnimatedButton
              text='Keep editing'
              style='ghost'
              onClick={() => close(false)}
            />
          </div>
        </div>
      </div>
    </Popup>
  )
}
