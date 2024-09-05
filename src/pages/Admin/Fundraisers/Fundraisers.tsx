import Table, { TableRef } from 'components/Table/Table'
import styles from './Fundraisers.module.css'
import { useContext, useEffect, useRef, useState } from 'react'
import { notificationContext } from 'context/NotificationContext'
import { Column } from 'types/Table'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import deleteDocuments from 'utils/firebase/deleteDocuments'
import FundraiserType from 'types/FundraiserType'
import getFundraisers from 'utils/firebase/fundraisers/getFundraisers'
import createClasses from 'utils/createClasses'
import { MdOpenInNew } from 'react-icons/md'
import FundraisersDrawer, {
  FundraisersDrawerData,
  FundraisersDrawerRef
} from './FundraisersDrawer'
import setFundraiser from 'utils/firebase/fundraisers/setFundraiser'
import { isAfter } from 'date-fns'

export default function Fundraisers() {
  type RowData = FundraiserType & { doc: QueryDocumentSnapshot; key: any }
  const [fundraisers, setFundraisers] = useState<RowData[]>([])
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { push: pushNotification } = useContext(notificationContext)
  const fundraisersDrawer = useRef<FundraisersDrawerRef>(null)
  const table = useRef<TableRef<RowData>>(null)

  const columns: Column<RowData>[] = [
    {
      key: 'name',
      name: 'Name',
      width: 200,
      sort(a: RowData['name'], b: RowData['name']) {
        return a.localeCompare(b)
      }
    },
    {
      key: 'description',
      name: 'Description',
      width: 200
    },
    {
      key: 'linkTitle',
      name: 'Link Title',
      width: 150
    },
    {
      key: 'linkLocation',
      name: 'Link',
      width: 60,
      allowOverflow: true
    },
    {
      key: 'endDate',
      name: 'State',
      width: 80
    }
  ]

  useEffect(() => {
    fetchFundraisers()
  }, [])

  async function fetchFundraisers() {
    setLoading(true)
    const f = await getFundraisers()
    setLoading(false)
    if (f.error) {
      return pushNotification({
        type: 'error',
        text: 'There was an error retrieving fundraiser data.',
        subtext: `Error code: ${f.error.code}`,
        timeout: -1,
        dismissable: true
      })
    }
    setFundraisers(
      f.data.map(({ data, doc }) => ({
        ...data,
        doc,
        key: doc.id
      }))
    )
  }

  function openDrawer(data?: RowData) {
    if (!data) {
      return fundraisersDrawer.current!.open()
    }

    const { key, ...rowData } = data
    fundraisersDrawer.current!.open({ ...rowData, type: 'edit' })
  }

  async function onSave(data: Omit<FundraisersDrawerData, 'type'>) {
    const { doc, ...saveData } = data
    const saveRes = await setFundraiser(saveData, doc)
    if (!saveRes.success) {
      pushNotification({
        type: 'error',
        text: `Failed to ${doc ? 'update' : 'add'} fundraiser!`,
        subtext: (saveRes.data.error as any).toString(),
        timeout: -1,
        dismissable: true
      })
      return false
    }

    fetchFundraisers()
    return true
  }

  async function onDelete() {
    const rows = table.current!.getSelectedRows()
    const docsToDelete = rows.map(r => r.doc)

    setIsDeleting(true)
    const deleteRes = await deleteDocuments(docsToDelete)
    setIsDeleting(false)

    if (!deleteRes.success) {
      pushNotification({
        type: 'error',
        text: `Failed to delete fundraisers!`,
        subtext: (deleteRes.data.error as any).toString(),
        timeout: -1,
        dismissable: true
      })
      return false
    }

    fetchFundraisers()
    return true
  }

  return (
    <div className='container'>
      <h1 className='admin-page-title'>Fundraisers</h1>
      <Table
        ref={table}
        data={fundraisers}
        columns={columns}
        loading={loading}
        selectable
        selectedActions={[
          <AnimatedButton
            key='delete'
            text='Delete'
            type='button'
            style='negative'
            size='small'
            loading={isDeleting}
            onClick={onDelete}
          />
        ]}
        maxWidth='100%'
        onRowClick={openDrawer}
        renderMap={(value, row) => {
          if (!value) return
          if ('name' in value) {
            return <span className={styles['table-item']}>{value.name}</span>
          } else if ('description' in value || 'linkTitle' in value) {
            return (
              <span
                className={`${styles['table-item']} ${styles['table-item--ellipsis']}`}>
                {Object.values(value)}
              </span>
            )
          } else if ('linkLocation' in value) {
            return (
              <a
                href={value.linkLocation}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`Link to ${row.linkTitle}`}
                className={createClasses({
                  [styles['table-item']]: true,
                  [styles['table-item--link']]: true,
                  'with-hover-circle': true
                })}
                onClick={e => e.stopPropagation()}>
                <MdOpenInNew />
              </a>
            )
          } else if ('endDate' in value) {
            const endDatePassed = isAfter(new Date(), value.endDate.toDate())
            return (
              <span
                className={createClasses({
                  [styles['date-pill']]: true,
                  [styles['date-pill--active']]: !endDatePassed,
                  [styles['date-pill--hidden']]: endDatePassed
                })}>
                {endDatePassed ? (
                  'Hidden'
                ) : (
                  'Active'
                )}
              </span>
            )
          }
          return <>{Object.values(value)}</>
        }}
      />
      <AnimatedButton
        text='Add fundraiser'
        onClick={() => openDrawer()}
        className={styles['add-button']}
      />
      <FundraisersDrawer
        ref={fundraisersDrawer}
        onSave={onSave}
      />
    </div>
  )
}
