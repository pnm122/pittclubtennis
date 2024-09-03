import Drawer from 'components/Drawer/Drawer'
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useReducer,
  useState
} from 'react'
import DrawerHeader from 'components/Drawer/DrawerHeader'
import FundraiserType from 'types/FundraiserType'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import DrawerContent from 'components/Drawer/DrawerContent'
import Input from 'components/Input/Input'
import styles from './Fundraisers.module.css'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import { notificationContext } from 'context/NotificationContext'
import EditWarningPopup from '../EditWarningPopup/EditWarningPopup'
import { Fundraiser } from 'pages/Fundraisers/Fundraisers'
import TextArea from 'components/TextArea/TextArea'

export type FundraisersDrawerData = FundraiserType & {
  doc?: QueryDocumentSnapshot
  type: 'edit' | 'add'
}

export interface FundraisersDrawerRef {
  open: (data?: FundraisersDrawerData) => void
  close: () => Promise<void>
}

interface Props {
  onSave: (data: Omit<FundraisersDrawerData, 'type'>) => Promise<boolean>
}

let warningPromiseResolve: (close: boolean) => void

const FundraisersDrawer = forwardRef<FundraisersDrawerRef, Props>(
  ({ onSave }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [type, setType] = useState<FundraisersDrawerData['type']>('edit')
    const [doc, setDoc] = useState<QueryDocumentSnapshot | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [edited, setEdited] = useState(false)
    const [showWarning, setShowWarning] = useState(false)
    const { push: pushNotification } = useContext(notificationContext)

    type State = {
      [key in keyof Required<FundraiserType>]: {
        data: FundraiserType[key]
        error?: string
      }
    }

    type ReducerAction =
      | {
          type: keyof FundraiserType
          data: FundraiserType[keyof FundraiserType]
        }
      | {
          type: 'init'
          data: FundraiserType
        }
      | {
          type: 'set'
          data: State
        }

    function reducer(state: State, { type, data }: ReducerAction) {
      if(type === 'set') {
        return data
      }

      if (type === 'init') {
        return {
          name: { data: data.name },
          description: { data: data.description },
          linkTitle: { data: data.linkTitle },
          linkLocation: { data: data.linkLocation }
        }
      }

      setEdited(true)
      return {
        ...state,
        [type]: {
          data
        }
      }
    }

    function getDefaultState() {
      return {
        name: { data: '' },
        description: { data: '' },
        linkTitle: { data: '' },
        linkLocation: { data: '' }
      }
    }

    function getDefaultData() {
      return {
        name: '',
        description: '',
        linkTitle: '',
        linkLocation: ''
      }
    }

    const [state, dispatch] = useReducer(reducer, getDefaultState())

    useImperativeHandle(ref, () => ({
      open,
      close
    }))

    function open(data?: FundraisersDrawerData) {
      if (data) {
        const { type: openType, doc: openDoc, ...openData } = data
        setType('edit')
        // Shouldn't ever be null here, will lead to errors
        setDoc(openDoc!)
        dispatch({ type: 'init', data: openData })
      } else {
        setType('add')
        setDoc(null)
        dispatch({ type: 'init', data: getDefaultData() })
      }
      setIsOpen(true)
    }

    async function close() {
      if(edited) {
        setShowWarning(true)
        const shouldCloseDrawer = await new Promise<boolean>(
          res => (warningPromiseResolve = res)
        )
        if (shouldCloseDrawer) {
          setIsOpen(false)
          setEdited(false)
        }
        setShowWarning(false)
        return
      }

      setIsOpen(false)
      setEdited(false)
    }

    async function save() {
      let hasError = false
      const updatedState = Object.fromEntries(
        Object.keys(state).map(key => {
          const data = state[key as keyof typeof state].data
          if(!data) hasError = true
          return [
            key,
            {
              data,
              ...(!data ? { error: 'This field is required.' } : {})
            }
          ]
        })
      ) as State
      
      dispatch({ type: 'set', data: updatedState })

      if (hasError) {
        pushNotification({
          type: 'default',
          text: 'Please fix all errors before saving!'
        })
        return
      }

      setIsSaving(true)

      const savedData = Object.fromEntries(
        Object.keys(state).map(key => [
          key,
          state[key as keyof typeof state].data
        ])
      ) as any as FundraisersDrawerData

      const saveRes = await onSave({
        ...savedData,
        doc: doc ?? undefined
      })

      setIsSaving(false)

      if (saveRes) {
        setIsOpen(false)
        setEdited(false)
      }
    }

    return (
      <>
        <Drawer
          size={400}
          orientation='right'
          open={isOpen}
          onBackdropClicked={close}>
          <DrawerHeader
            title={`${type === 'edit' ? 'Edit' : 'Add'} Fundraiser`}
            onClose={close}
          />
          <DrawerContent>
            <form className='drawer-form'>
              <Input
                label='Name'
                name='name'
                value={state.name.data}
                error={state.name.error}
                onChange={e => dispatch({ type: 'name', data: e.target.value })}
                required
              />
              <TextArea
                label='Description'
                name='description'
                value={state.description.data}
                error={state.description.error}
                onChange={e => dispatch({ type: 'description', data: e.target.value })}
                resize='vertical'
                height='100px'
                required
              />
              <Input
                label='Link'
                name='link'
                value={state.linkLocation.data}
                error={state.linkLocation.error}
                onChange={e => dispatch({ type: 'linkLocation', data: e.target.value })}
                required
              />
              <Input
                label='Link Title'
                name='link-title'
                value={state.linkTitle.data}
                error={state.linkTitle.error}
                onChange={e => dispatch({ type: 'linkTitle', data: e.target.value })}
                required
              />
            </form>
            <div className={styles['preview']}>
              <h2 className={styles['preview__title']}>Preview</h2>
              <Fundraiser
                name={state.name.data}
                description={state.description.data}
                linkLocation={state.linkLocation.data}
                linkTitle={state.linkTitle.data}
              />
            </div>
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
              onClick={() => close()}
            />
          </div>
        </Drawer>
        <EditWarningPopup
          open={showWarning}
          close={warningPromiseResolve}
        />
      </>
    )
  }
)

export default FundraisersDrawer
