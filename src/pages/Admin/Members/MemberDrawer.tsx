import Drawer from 'components/Drawer/Drawer'
import styles from './Members.module.css'
import DrawerHeader from 'components/Drawer/DrawerHeader'
import DrawerContent from 'components/Drawer/DrawerContent'
import MemberDrawerContent, { MemberDrawerContentRef, MemberDrawerState } from './MemberDrawerContent'
import Popup from 'components/Popup/Popup'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import { MdWarning } from "react-icons/md"
import { QueryDocumentSnapshot } from 'firebase/firestore'

export interface AdminMemberDrawer {
  data: MemberType
  doc: QueryDocumentSnapshot
  type: 'edit' | 'add'
}

export interface MemberDrawerRef {
  open: (data: AdminMemberDrawer) => void
}

interface Props {
  onSave: (data: { state: MemberDrawerState, doc: QueryDocumentSnapshot }) => void
}

let warningPromiseResolve: (close: boolean) => void

const MemberDrawer = forwardRef<MemberDrawerRef, Props>(({
  onSave
}, ref) => {
  const [drawerData, setDrawerData] = useState<AdminMemberDrawer | null>(null)
  // Track if the drawer has been edited to show a warning when trying to close the drawer
  const [drawerEdited, setDrawerEdited] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const memberDrawerContent = useRef<MemberDrawerContentRef>(null)

  function open(data: AdminMemberDrawer) {
    setDrawerData(data)
    setIsOpen(true)
  }

  useImperativeHandle(ref, () => ({
    open
  }))

  
  async function closeDrawer() {
    if(drawerEdited) {
      setShowWarning(true)
      const shouldCloseDrawer = await new Promise<boolean>(res => warningPromiseResolve = res)
      if(shouldCloseDrawer) {
        setIsOpen(false)
        setDrawerEdited(false)
      }
      setShowWarning(false)
      return
    }

    setIsOpen(false)
    setDrawerEdited(false)
  }

  function save() {
    onSave(memberDrawerContent.current!.getState())
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
          />
          <AnimatedButton
            text={'Cancel'}
            style='ghost'
            onClick={() => closeDrawer()}
          />
        </div>
      </Drawer>
      <Popup
        open={showWarning}
      >
        <div className={styles['popup']}>
          <div className={styles['popup__warning-label']}>
            <MdWarning />
            <span>Warning</span>
          </div>
          <div className={styles['popup__body']}>
            <h1 className={styles['popup__title']}>You have unsaved changes!</h1>
            <p>Are you sure you want to cancel editing? This action cannot be undone.</p>
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