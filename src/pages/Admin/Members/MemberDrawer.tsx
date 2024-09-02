import Drawer from 'components/Drawer/Drawer'
import styles from './Members.module.css'
import DrawerHeader from 'components/Drawer/DrawerHeader'
import DrawerContent from 'components/Drawer/DrawerContent'
import MemberDrawerContent, {
  MemberDrawerContentRef,
  MemberDrawerState
} from './MemberDrawerContent'
import Popup from 'components/Popup/Popup'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import { MdWarning } from 'react-icons/md'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import { MemberType } from 'types/MemberType'

export type AdminMemberDrawer =
  | {
      data: MemberType
      doc: QueryDocumentSnapshot
      type: 'edit'
    }
  | {
      type: 'add'
    }

export interface DrawerData {
  data: MemberType
  doc?: QueryDocumentSnapshot
  type: 'edit' | 'add'
}

export interface MemberDrawerRef {
  open: (data: AdminMemberDrawer) => void
  close: () => void
}

interface Props {
  onSave: (data: {
    state: MemberDrawerState
    doc?: QueryDocumentSnapshot
  }) => Promise<void>
}

let warningPromiseResolve: (close: boolean) => void

const MemberDrawer = forwardRef<MemberDrawerRef, Props>(({ onSave }, ref) => {
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null)
  // Track if the drawer has been edited to show a warning when trying to close the drawer
  const [drawerEdited, setDrawerEdited] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const memberDrawerContent = useRef<MemberDrawerContentRef>(null)

  function open(data: AdminMemberDrawer) {
    if (data.type === 'edit') {
      setDrawerData(data)
    } else {
      setDrawerData({
        ...data,
        data: {
          name: '',
          role: 'None',
          year: 'freshman'
        }
      })
    }
    setIsOpen(true)
  }

  useImperativeHandle(ref, () => ({
    open,
    close
  }))

  function close() {
    setIsOpen(false)
    setDrawerEdited(false)
  }

  async function closeDrawer() {
    if (drawerEdited) {
      setShowWarning(true)
      const shouldCloseDrawer = await new Promise<boolean>(
        res => (warningPromiseResolve = res)
      )
      if (shouldCloseDrawer) {
        setIsOpen(false)
        setDrawerEdited(false)
      }
      setShowWarning(false)
      return
    }

    setIsOpen(false)
    setDrawerEdited(false)
  }

  async function save() {
    if (!memberDrawerContent.current?.isValid()) {
      console.log(memberDrawerContent.current?.isValid())
      console.log('invalid')
      return
    }
    setIsSaving(true)
    await onSave(memberDrawerContent.current!.getState())
    setIsSaving(false)
  }

  return (
    <>
      <Drawer
        size={350}
        orientation='right'
        open={isOpen}
        onBackdropClicked={closeDrawer}>
        <DrawerHeader
          title={drawerData?.type === 'add' ? 'Add Member' : 'Edit Member'}
          onClose={closeDrawer}
        />
        <DrawerContent>
          {drawerData && (
            <>
              <MemberDrawerContent
                {...drawerData}
                onEdited={() => setDrawerEdited(true)}
                open={isOpen}
                ref={memberDrawerContent}
              />
            </>
          )}
        </DrawerContent>
        <div className={styles['member-drawer__actions']}>
          <AnimatedButton
            text={'Save'}
            onClick={save}
            loading={isSaving}
          />
          <AnimatedButton
            text={'Cancel'}
            style='ghost'
            onClick={() => closeDrawer()}
          />
        </div>
      </Drawer>
      <Popup open={showWarning}>
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
                onClick={() => warningPromiseResolve(true)}
              />
              <AnimatedButton
                text='Keep editing'
                style='ghost'
                onClick={() => warningPromiseResolve(false)}
              />
            </div>
          </div>
        </div>
      </Popup>
    </>
  )
})

export default MemberDrawer
