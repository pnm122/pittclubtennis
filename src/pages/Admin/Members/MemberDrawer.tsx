import Drawer from 'components/Drawer/Drawer'
import DrawerHeader from 'components/Drawer/DrawerHeader'
import DrawerContent from 'components/Drawer/DrawerContent'
import MemberDrawerContent, {
  MemberDrawerContentRef,
  MemberDrawerState
} from './MemberDrawerContent'
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import { MemberType } from 'types/MemberType'
import EditWarningPopup from '../EditWarningPopup/EditWarningPopup'
import { notificationContext } from 'context/NotificationContext'

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
  const [showWarning, setShowWarning] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const memberDrawerContent = useRef<MemberDrawerContentRef>(null)
  const { push: pushNotification } = useContext(notificationContext)

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
  }

  async function closeDrawer() {
    if (memberDrawerContent.current?.isEdited()) {
      setShowWarning(true)
      const shouldCloseDrawer = await new Promise<boolean>(
        res => (warningPromiseResolve = res)
      )
      if (shouldCloseDrawer) {
        setIsOpen(false)
      }
      setShowWarning(false)
      return
    }

    setIsOpen(false)
  }

  async function save() {
    if (!memberDrawerContent.current?.checkValidity()) {
      pushNotification({
        text: 'Please fix all errors before saving!'
      })
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
                open={isOpen}
                ref={memberDrawerContent}
              />
            </>
          )}
        </DrawerContent>
        <div className='drawer-actions'>
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
      <EditWarningPopup
        open={showWarning}
        close={warningPromiseResolve}
      />
    </>
  )
})

export default MemberDrawer
