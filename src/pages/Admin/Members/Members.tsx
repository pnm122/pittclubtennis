import styles from '../Admin.module.css'
import Table from 'components/Table/Table'
import { Column } from 'types/Table'
import createClasses from 'utils/createClasses'
import { getRoleColors } from 'utils/getRoleColors'
import { IoMdCheckmark } from 'react-icons/io'
import { useEffect, useRef, useState } from 'react'
import MemberDrawer, { MemberDrawerRef } from './MemberDrawer'
import getMembers from 'utils/firebase/getMembers'

type RowData = Readonly<MemberType & { key: any }>

export default function Members() {
  const memberDrawer = useRef<MemberDrawerRef>(null)
  const [memberData, setMemberData] = useState<RowData[]>([])
  const [loading, setLoading] = useState(true)
  const columns: Column<RowData>[] = [{
    key: 'name',
    name: 'Name',
    width: 250,
    sort: (a: RowData['name'], b: RowData['name']) => a.localeCompare(b)
  }, {
    key: 'year',
    name: 'Year',
    width: 125,
    sort: (a: RowData['name'], b: RowData['name']) => {
      const order = ['graduate student', 'senior', 'junior', 'sophomore', 'freshman']
      const aIndex = order.findIndex(o => o.toUpperCase() === a.toUpperCase())
      const bIndex = order.findIndex(o => o.toUpperCase() === b.toUpperCase())
      return aIndex === bIndex ? 0 : aIndex > bIndex ? 1 : -1;
    }
  }, {
    key: 'role',
    name: 'Role',
    width: 190
  }, {
    key: 'imgSrc',
    name: 'Image Uploaded',
    width: 175,
    sort: (a: RowData['imgSrc'], b: RowData['imgSrc']) => (
      a === b ? 0 : b && !a ? 1 : -1
    )
  }]

  useEffect(() => {
    fetchMembers()
  }, [])

  async function fetchMembers() {
    const res = await getMembers()
    setLoading(false)
    if(res.error) {
      console.error(res.error)
      return
    } else if(res) {
      setMemberData(res.data.map(m => ({
        ...m,
        key: m.imgSrc
      })))
    }
  }

  const openEditDrawer = (row: RowData) => {
    memberDrawer.current?.open({
      data: row,
      type: 'edit'
    })
  }

  return (
    <>
      <MemberDrawer
        ref={memberDrawer}
        onSave={(data) => console.log(data)}
      />
      <div className='container'>
        <h1 className='admin-page-title'>Members</h1>
        <div style={{overflow: 'auto', marginTop: '16px'}}>
          <Table
            data={memberData}
            columns={columns}
            loading={loading}
            selectable
            selectedActions={[{
              name: 'Delete',
              sentiment: 'negative',
              onClick: (selectedRows) => console.log(selectedRows)
            }]}
            onRowClick={(row) => openEditDrawer(row)}
            renderMap={(value) => {
              if(!value) return
              if('name' in value) {
                return <p className={styles['member__name']}>{value.name}</p>
              } else if('year' in value) {
                return <p className={styles['member__year']}>{value.year}</p>
              } else if('role' in value) {
                const roleClasses = createClasses({
                  [styles['member__role']]: true,
                  [styles['member__role--none']]: !!!value.role
                })
                const { bg, text } = getRoleColors(value.role)
    
                return (
                  <p 
                    className={roleClasses} 
                    style={{ '--role-text-color': text, '--role-bg-color': bg } as React.CSSProperties}>
                    {!!value.role ? value.role : 'None'}
                  </p>
                )
              } else if ('imgSrc' in value) {
                return !!value.imgSrc ? (
                  <div className={styles['uploaded-checkmark']}>
                    <IoMdCheckmark />
                  </div>
                ) : <></>
              }
            }}
          />
        </div>
      </div>
    </>
  )
}