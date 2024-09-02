import Table from 'components/Table/Table'
import styles from './Tournaments.module.css'
import tournamentComponentStyles from 'components/Tournament/Tournament.module.css'
import { useContext, useEffect, useState } from 'react'
import TournamentType from 'types/TournamentType'
import getTournaments from 'utils/firebase/getTournaments'
import { notificationContext } from 'context/NotificationContext'
import { Column } from 'types/Table'
import { formatDate } from 'date-fns'
import createClasses from 'utils/createClasses'
import { MdOpenInNew } from "react-icons/md"

export default function Tournaments() {
  type RowData = TournamentType & { key: any }
  const [tournaments, setTournaments] = useState<RowData[]>([])
  const [loading, setLoading] = useState(false)
  const { push: pushNotification } = useContext(notificationContext)

  const columns: Column<RowData>[] = [{
    key: 'name',
    name: 'Name',
    width: 200,
    sort(a: RowData['name'], b: RowData['name']) {
      return a.localeCompare(b)
    }
  }, {
    key: 'dateStart',
    name: 'Start Date',
    width: 125,
    sort(a: RowData['dateStart'], b: RowData['dateStart']) {
      return b.seconds - a.seconds
    }
  }, {
    key: 'dateEnd',
    name: 'End Date',
    width: 125,
    sort(a: RowData['dateStart'], b: RowData['dateStart']) {
      return b.seconds - a.seconds
    }
  }, {
    key: 'locationName',
    name: 'Location',
    width: 200
  }, {
    key: 'locationLink',
    name: 'Link',
    allowOverflow: true,
    width: 60
  }, {
    key: 'placement',
    name: 'Placement',
    width: 125,
    sort(a: RowData['placement'], b: RowData['placement']) {
      if(a === undefined && b === undefined) return 0
      if(a === undefined) return 1
      if(b === undefined) return -1
      return a - b
    }
  }]

  useEffect(() => {
    fetchTournaments()
  }, [])

  async function fetchTournaments() {
    setLoading(true)
    const t = await getTournaments()
    setLoading(false)
    if(t.error) {
      return pushNotification({
        type: 'error',
        text: 'There was an error retrieving tournament data.',
        subtext: `Error code: ${t.error.code}`,
        timeout: -1,
        dismissable: true
      })
    }
    setTournaments(t.data.map(e => ({ ...e, key: `${e.name}${e.dateStart.toString()}` })))
  }

  return (
    <div className='container'>
      <h1 className='admin-page-title'>Tournaments</h1>
      <Table
        data={tournaments}
        columns={columns}
        loading={loading}
        selectable
        maxWidth='100%'
        renderMap={(value, row) => {
          if(!value) return
          if('dateStart' in value || 'dateEnd' in value) {
            return (
              <span className={createClasses({
                [styles['table-item']]: true,
                [styles['table-item--date']]: true
              })}>
                {formatDate(Object.values(value)[0].toDate(), 'MMM dd, yyyy')}
              </span>
            )
          } else if('name' in value) {
            return (
              <span className={createClasses({
                [styles['table-item']]: true,
                [styles['table-item--name']]: true
              })}>
                {value.name}
              </span>
            )
          } else if('locationName' in value) {
            return (
              <span className={createClasses({
                [styles['table-item']]: true,
                [styles['table-item--other']]: true
              })}>
                {value.locationName}
              </span>
            )
          } else if('locationLink' in value) {
            return (
              <a
                href={value.locationLink}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`Link to ${row.locationName}`}
                className={createClasses({
                  [styles['table-item']]: true,
                  [styles['table-item--link']]: true,
                  'with-hover-circle': true
                })}>
                <MdOpenInNew />
              </a>
            )
          } else if('placement' in value) {
            console.log('placement', value.placement)
            return value.placement ? (
              <span className={`${tournamentComponentStyles['place']} ${tournamentComponentStyles[`p${value.placement}`]} ${styles['table-item--placement']}`}></span>
            ) : (
              <span className={createClasses({
                [styles['table-item']]: true,
                [styles['table-item--none']]: true
              })}>
                None
              </span>
            )
          }
        }}
      />
    </div>
  )
}
