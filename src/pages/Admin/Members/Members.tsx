import styles from './Members.module.css'
import Table, { TableRef } from 'components/Table/Table'
import { Column } from 'types/Table'
import createClasses from 'utils/createClasses'
import { getRoleColors } from 'utils/getRoleColors'
import { IoMdCheckmark } from 'react-icons/io'
import { useContext, useEffect, useRef, useState } from 'react'
import MemberDrawer, { MemberDrawerRef } from './MemberDrawer'
import getMembers from 'utils/firebase/members/getMembers'
import { MemberDrawerState } from './MemberDrawerContent'
import { QueryDocumentSnapshot } from 'firebase/firestore'
import setMember from 'utils/firebase/members/setMember'
import { MemberType } from 'types/MemberType'
import deleteMembers from 'utils/firebase/members/deleteMembers'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import { notificationContext } from 'context/NotificationContext'

export default function Members() {
  type RowData = Readonly<MemberType & { key: any }>

  const { push: pushNotification } = useContext(notificationContext)

  const table = useRef<TableRef<RowData>>(null)
  const memberDrawer = useRef<MemberDrawerRef>(null)
  const [memberData, setMemberData] = useState<
    { data: MemberType; doc: QueryDocumentSnapshot }[]
  >([])
  // Derived directly from memberData, used in table
  const [tableData, setTableData] = useState<RowData[]>([])
  // Whether the page is waiting for members to load
  const [loading, setLoading] = useState(true)
  // Whether the page is waiting for members to be deleted
  const [isDeleting, setIsDeleting] = useState(false)
  const columns: Column<RowData>[] = [
    {
      key: 'name',
      name: 'Name',
      width: 250,
      sort: (a: RowData['name'], b: RowData['name']) => a.localeCompare(b)
    },
    {
      key: 'year',
      name: 'Year',
      width: 125,
      sort: (a: RowData['name'], b: RowData['name']) => {
        const order = [
          'graduate student',
          'senior',
          'junior',
          'sophomore',
          'freshman'
        ]
        const aIndex = order.findIndex(o => o.toUpperCase() === a.toUpperCase())
        const bIndex = order.findIndex(o => o.toUpperCase() === b.toUpperCase())
        return aIndex === bIndex ? 0 : aIndex > bIndex ? 1 : -1
      }
    },
    {
      key: 'role',
      name: 'Role',
      width: 190
    },
    {
      key: 'imgSrc',
      name: 'Image Uploaded',
      width: 175,
      sort: (a: RowData['imgSrc'], b: RowData['imgSrc']) =>
        a === b ? 0 : b && !a ? 1 : -1
    }
  ]

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => {
    setTableData(memberData.map(m => ({ ...m.data, key: m.doc.id })))
  }, [memberData])

  async function fetchMembers() {
    setLoading(true)
    const res = await getMembers()
    setLoading(false)
    if (res.error) {
      pushNotification({
        type: 'error',
        text: 'There was an error retrieving the members.',
        subtext: `Error code: ${res.error.code}`,
        timeout: -1,
        dismissable: true
      })
      return
    } else if (res) {
      setMemberData(res.data)
    }
  }

  const openEditDrawer = (row: RowData) => {
    memberDrawer.current?.open({
      data: row,
      type: 'edit',
      doc: memberData.find(m => m.doc.id === row.key)!.doc
    })
  }

  const openAddMemberDrawer = () => {
    memberDrawer.current?.open({
      type: 'add'
    })
  }

  async function onSave(data: {
    state: MemberDrawerState
    doc?: QueryDocumentSnapshot
  }) {
    const { success, data: setData } = await setMember(data.state, data.doc)
    if (success) {
      pushNotification({
        type: 'success',
        text: `Successfully ${data.doc ? 'updated' : 'created'} member ${data.state.name}!`
      })
      memberDrawer.current?.close()
      fetchMembers()
    } else {
      pushNotification({
        type: 'error',
        text: `Failed to ${data.doc ? 'updated' : 'created'} member ${data.state.name}!`,
        subtext: (setData.error as any).toString(),
        timeout: -1,
        dismissable: true
      })
    }
  }

  async function onDelete() {
    const rows = table.current!.getSelectedRows()

    const docsToDelete = rows.map(
      r =>
        memberData.find(
          ({ data: { name, role, year } }) =>
            r.name === name && r.role === role && r.year === year
        )!.doc
    )

    setIsDeleting(true)
    const { success, data } = await deleteMembers(docsToDelete)
    setIsDeleting(false)
    if (success) {
      pushNotification({
        type: 'success',
        text: `Successfully deleted ${docsToDelete.length} member${docsToDelete.length > 1 ? 's' : ''}!`
      })
      fetchMembers()
    } else {
      pushNotification({
        type: 'error',
        text: `Failed to delete documents!`,
        subtext: (data.error as any).toString(),
        timeout: -1,
        dismissable: true
      })
    }
  }

  return (
    <>
      <MemberDrawer
        ref={memberDrawer}
        onSave={onSave}
      />
      <div className='container'>
        <h1 className='admin-page-title'>Members</h1>
        <div style={{ overflow: 'auto', marginTop: '16px' }}>
          <Table
            ref={table}
            data={tableData}
            columns={columns}
            loading={loading}
            selectable
            selectedActions={
              <AnimatedButton
                type='button'
                text='Delete'
                size='small'
                style='negative'
                loading={isDeleting}
                onClick={onDelete}
              />
            }
            onRowClick={row => openEditDrawer(row)}
            renderMap={value => {
              if (!value) return
              if ('name' in value) {
                return <p className={styles['member__name']}>{value.name}</p>
              } else if ('year' in value) {
                return <p className={styles['member__year']}>{value.year}</p>
              } else if ('role' in value) {
                const roleClasses = createClasses({
                  [styles['member__role']]: true,
                  [styles['member__role--none']]:
                    !!!value.role || value.role === 'None'
                })
                const { bg, text } = getRoleColors(value.role)

                return (
                  <p
                    className={roleClasses}
                    style={
                      {
                        '--role-text-color': text,
                        '--role-bg-color': bg
                      } as React.CSSProperties
                    }>
                    {!!value.role ? value.role : 'None'}
                  </p>
                )
              } else if ('imgSrc' in value) {
                return !!value.imgSrc ? (
                  <div className={styles['uploaded-checkmark']}>
                    <IoMdCheckmark />
                  </div>
                ) : (
                  <></>
                )
              }
            }}
          />
        </div>
        <AnimatedButton
          text='Add member'
          type='button'
          className={styles['add-member']}
          onClick={openAddMemberDrawer}
        />
      </div>
    </>
  )
}
