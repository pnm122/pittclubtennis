import Drawer from 'components/Drawer/Drawer'
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useReducer,
  useState
} from 'react'
import DrawerHeader from 'components/Drawer/DrawerHeader'
import TournamentType from 'types/TournamentType'
import { QueryDocumentSnapshot, Timestamp } from 'firebase/firestore'
import DrawerContent from 'components/Drawer/DrawerContent'
import Input from 'components/Input/Input'
import Datepicker from 'components/Datepicker/Datepicker'
import styles from './Tournaments.module.css'
import { isAfter, isBefore, isSameDay } from 'date-fns'
import Select from 'components/Select/Select'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import Tournament from 'components/Tournament/Tournament'
import { notificationContext } from 'context/NotificationContext'
import EditWarningPopup from '../EditWarningPopup/EditWarningPopup'

export type TournamentsDrawerData = TournamentType & {
  doc?: QueryDocumentSnapshot
  type: 'edit' | 'add'
}

export interface TournamentsDrawerRef {
  open: (data?: TournamentsDrawerData) => void
  close: () => Promise<void>
}

interface Props {
  onSave: (data: Omit<TournamentsDrawerData, 'type'>) => Promise<boolean>
}

let warningPromiseResolve: (close: boolean) => void

const TournamentsDrawer = forwardRef<TournamentsDrawerRef, Props>(
  ({ onSave }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [type, setType] = useState<TournamentsDrawerData['type']>('edit')
    const [doc, setDoc] = useState<QueryDocumentSnapshot | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [edited, setEdited] = useState(false)
    const [showWarning, setShowWarning] = useState(false)
    const { push: pushNotification } = useContext(notificationContext)

    type State = {
      [key in keyof Required<TournamentType>]: {
        data: TournamentType[key]
        error?: string
      }
    }

    type ReducerAction =
      | {
          type: keyof TournamentType
          data: TournamentType[keyof TournamentType]
        }
      | {
          type: 'init'
          data: TournamentType
        }

    function reducer(state: State, { type, data }: ReducerAction) {
      if (type === 'init') {
        return {
          name: { data: data.name },
          dateStart: { data: data.dateStart },
          dateEnd: { data: data.dateEnd },
          locationName: { data: data.locationName },
          locationLink: { data: data.locationLink },
          placement: { data: data.placement }
        }
      }

      setEdited(true)
      let newState = {
        ...state,
        [type]: {
          data
        }
      }

      if (['dateStart', 'dateEnd'].includes(type)) {
        const isInvalidDateRange =
          !isSameDay(
            newState.dateStart.data.toDate(),
            newState.dateEnd.data.toDate()
          ) &&
          isAfter(
            newState.dateStart.data.toDate(),
            newState.dateEnd.data.toDate()
          )
        if (isInvalidDateRange) {
          newState.dateStart.error = 'Start date must be before end date.'
          newState.dateEnd.error = 'End date must be after start date.'
        } else {
          newState.dateStart.error = ''
          newState.dateEnd.error = ''
        }
      }

      return newState
    }

    function getDefaultState() {
      return {
        name: { data: '' },
        dateStart: { data: Timestamp.fromDate(new Date()) },
        dateEnd: { data: Timestamp.fromDate(new Date()) },
        locationName: { data: '' },
        locationLink: { data: '' },
        placement: { data: undefined }
      }
    }

    function getDefaultData() {
      return {
        name: '',
        dateStart: Timestamp.fromDate(new Date()),
        dateEnd: Timestamp.fromDate(new Date()),
        locationName: '',
        locationLink: '',
        placement: undefined
      }
    }

    const [state, dispatch] = useReducer(reducer, getDefaultState())

    useImperativeHandle(ref, () => ({
      open,
      close
    }))

    function open(data?: TournamentsDrawerData) {
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
      if (edited) {
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
      const hasError = !!Object.keys(state).find(
        key => !!state[key as keyof typeof state].error
      )
      if (hasError) {
        pushNotification({
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
      ) as any as TournamentsDrawerData

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
            title={`${type === 'edit' ? 'Edit' : 'Add'} Tournament`}
            onClose={close}
          />
          <DrawerContent>
            <form className='drawer-form'>
              <Input
                label='Name'
                name='tournament-name'
                value={state.name.data}
                error={state.name.error}
                onChange={e => dispatch({ type: 'name', data: e.target.value })}
                required
              />
              <Datepicker
                label='Start Date'
                value={state.dateStart.data.toDate()}
                error={state.dateStart.error}
                onChange={date =>
                  dispatch({
                    type: 'dateStart',
                    data: Timestamp.fromDate(date)
                  })
                }
                required
              />
              <Datepicker
                label='End Date'
                disabledDates={date =>
                  isBefore(date, state.dateStart.data.toDate())
                }
                value={state.dateEnd.data.toDate()}
                error={state.dateEnd.error}
                onChange={date =>
                  dispatch({ type: 'dateEnd', data: Timestamp.fromDate(date) })
                }
                required
              />
              <Input
                label='Location Name'
                name='location-name'
                value={state.locationName.data}
                error={state.locationName.error}
                onChange={e =>
                  dispatch({ type: 'locationName', data: e.target.value })
                }
                required
              />
              <Input
                label='Location Link'
                name='location-link'
                value={state.locationLink.data}
                error={state.locationLink.error}
                onChange={e =>
                  dispatch({ type: 'locationLink', data: e.target.value })
                }
                required
              />
              <Select
                label='Placement'
                options={[
                  {
                    name: 'None',
                    value: undefined
                  },
                  {
                    name: 'First Place',
                    value: 1
                  },
                  {
                    name: 'Second Place',
                    value: 2
                  },
                  {
                    name: 'Third Place',
                    value: 3
                  }
                ]}
                value={state.placement.data}
                onChange={(selected) =>
                  dispatch({ type: 'placement', data: selected })
                }
                required
              />
            </form>
            <div className={styles['preview']}>
              <h2 className={styles['preview__title']}>Preview</h2>
              <Tournament
                name={state.name.data}
                locationName={state.locationName.data}
                locationLink={state.locationLink.data}
                placement={state.placement.data}
                dateStart={state.dateStart.data}
                dateEnd={state.dateEnd.data}
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

export default TournamentsDrawer
