import Drawer from 'components/Drawer/Drawer'
import { forwardRef, useImperativeHandle, useReducer, useState } from 'react'
import DrawerHeader from 'components/Drawer/DrawerHeader'
import TournamentType from 'types/TournamentType'
import { Timestamp } from 'firebase/firestore'
import DrawerContent from 'components/Drawer/DrawerContent'
import Input from 'components/Input/Input'
import Datepicker from 'components/Datepicker/Datepicker'
import styles from './Tournaments.module.css'
import { isAfter, isBefore } from 'date-fns'
import Select from 'components/Select/Select'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import Tournament from 'components/Tournament/Tournament'

export type TournamentsDrawerData = TournamentType & {
  type: 'edit' | 'add'
}

export interface TournamentsDrawerRef {
  open: (data: TournamentsDrawerData) => void
  close: () => void
}

const TournamentsDrawer = forwardRef<TournamentsDrawerRef>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false)

  type State = {
    [key in keyof Required<TournamentType>]: {
      data: TournamentType[key]
      error?: string
    }
  }

  function reducer(
    state: State,
    { type, data }: { type: keyof TournamentType; data: TournamentType[keyof TournamentType] }
  ) {
    let newState = {
      ...state,
      [type]: {
        data,
      }
    }

    if(['dateStart', 'dateEnd'].includes(type)) {
      const isInvalidDateRange = isAfter(newState.dateStart.data.toDate(), newState.dateEnd.data.toDate())
      if(isInvalidDateRange) {
        newState.dateStart.error = 'Start date must be before end date.'
        newState.dateEnd.error = 'End date must be after start date.'
      } else {
        newState.dateStart.error = ''
        newState.dateEnd.error = ''
      }
    }

    return newState
  }

  const [state, dispatch] = useReducer(
    reducer, 
    {
      name: { data: '' },
      dateStart: { data: Timestamp.fromDate(new Date()) },
      dateEnd: { data: Timestamp.fromDate(new Date()) },
      locationName: { data: '' },
      locationLink: { data: '' },
      placement: { data: undefined }
    }
  )

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close
  }))

  function close() {
    setIsOpen(false)
  }

  return (
    <Drawer
      size={400}
      orientation='right'
      open={isOpen}
      onBackdropClicked={close}>
      <DrawerHeader
        title={`Edit Tournament`}
        onClose={close}
      />
      <DrawerContent>
        <form className={styles['drawer-form']}>
          <Input
            label='Name'
            name='name'
            value={state.name.data}
            error={state.name.error}
            onChange={e => dispatch({ type: 'name', data: e.target.value })}
            required
          />
          <Datepicker
            label='Start Date'
            value={state.dateStart.data.toDate()}
            error={state.dateStart.error}
            onChange={date => dispatch({ type: 'dateStart', data: Timestamp.fromDate(date) })}
            required
          />
          <Datepicker
            label='End Date'
            disabledDates={date => isBefore(date, state.dateStart.data.toDate())}
            value={state.dateEnd.data.toDate()}
            error={state.dateEnd.error}
            onChange={date => dispatch({ type: 'dateEnd', data: Timestamp.fromDate(date) })}
            required
          />
          <Input
            label='Location Name'
            name='location-name'
            value={state.locationName.data}
            error={state.locationName.error}
            onChange={e => dispatch({ type: 'locationName', data: e.target.value })}
            required
          />
          <Input
            label='Location Link'
            name='location-link'
            value={state.locationLink.data}
            error={state.locationLink.error}
            onChange={e => dispatch({ type: 'locationLink', data: e.target.value })}
            required
          />
          <Select
            label='Placement'
            options={[{
              name: 'None',
              value: undefined
            }, {
              name: 'First',
              value: 1
            }, {
              name: 'Second',
              value: 2
            }, {
              name: 'Third',
              value: 3
            }]}
            value={state.placement.data}
            onChange={({ selected }) => dispatch({ type: 'placement', data: selected })}
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
      <div className={styles['drawer-actions']}>
        <AnimatedButton
          text={'Save'}
          // onClick={save}
          // loading={isSaving}
        />
        <AnimatedButton
          text={'Cancel'}
          style='ghost'
          onClick={() => close()}
        />
      </div>
    </Drawer>
  )
})

export default TournamentsDrawer
