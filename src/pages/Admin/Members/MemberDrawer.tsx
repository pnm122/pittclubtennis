import Drawer from 'components/Drawer/Drawer'
import styles from './Members.module.css'
import DrawerHeader from 'components/Drawer/DrawerHeader'
import DrawerContent from 'components/Drawer/DrawerContent'
import MemberDrawerContent from './MemberDrawerContent'
import Popup from 'components/Popup/Popup'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { AdminMemberDrawer } from 'types/AdminMembers'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import { MdWarning } from "react-icons/md"

export interface MemberDrawerRef {
  open: (data: AdminMemberDrawer) => void
}

let warningPromiseResolve: (close: boolean) => void

const MemberDrawer = forwardRef<MemberDrawerRef>(({

}, ref) => {
  const [drawerData, setDrawerData] = useState<AdminMemberDrawer | null>(null)
  // Track if the drawer has been edited to show a warning when trying to close the drawer
  const [drawerEdited, setDrawerEdited] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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
                closeDrawer={closeDrawer}
                onEdited={() => setDrawerEdited(true)}
                open={isOpen}
              />
            </>
          )}
        </DrawerContent>
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