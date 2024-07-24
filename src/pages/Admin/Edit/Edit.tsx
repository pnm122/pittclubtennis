import styles from '../Admin.module.css'
import Table from 'components/Table/Table'
import { Column } from 'types/Table'
import createClasses from 'utils/createClasses'
import { getRoleColors } from 'utils/getRoleColors'
import { IoMdCheckmark } from 'react-icons/io'
import Drawer from 'components/Drawer/Drawer'
import { useState } from 'react'
import DrawerHeader from 'components/Drawer/DrawerHeader'
import DrawerContent from 'components/Drawer/DrawerContent'

export default function Edit() {
  type RowData = Readonly<{
    key: any,
    name: string,
    year: string,
    role: string,
    imageUploaded: boolean
  }>
  
  const rows: RowData[] = [{
    key: 1,
    name: 'Chris Perry',
    year: 'senior',
    role: 'President',
    imageUploaded: true
  }, {
    key: 2,
    name: 'Irene Yang',
    year: 'senior',
    role: 'President',
    imageUploaded: true
  }, {
    key: 6,
    name: 'Alex Kufner',
    year: 'junior',
    role: 'Vice President',
    imageUploaded: true
  }, {
    key: 7,
    name: 'Olivia Dodge',
    year: 'senior',
    role: 'Business Manager',
    imageUploaded: false
  }, {
    key: 8,
    name: 'Rohan Krishnan',
    year: 'senior',
    role: 'Logistics Manager',
    imageUploaded: false
  }, {
    key: 3,
    name: 'Pierce Martin',
    year: 'senior',
    role: 'Social Chair',
    imageUploaded: false
  }, {
    key: 4,
    name: 'Ashley Belous',
    year: 'sophomore',
    role: 'Social Chair',
    imageUploaded: true
  }, {
    key: 9,
    name: 'Jonah Osband',
    year: 'senior',
    role: 'Fundraising Chair',
    imageUploaded: false
  }, {
    key: 10,
    name: 'Amanda Santora',
    year: 'junior',
    role: 'Fundraising Committee',
    imageUploaded: false
  }, {
    key: 5,
    name: 'Riya Shah',
    year: 'sophomore',
    role: '',
    imageUploaded: true
  }]

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
      const aIndex = order.findIndex(o => o === a)
      const bIndex = order.findIndex(o => o === b)
      return aIndex === bIndex ? 0 : aIndex > bIndex ? 1 : -1;
    }
  }, {
    key: 'role',
    name: 'Role',
    width: 190
  }, {
    key: 'imageUploaded',
    name: 'Image Uploaded',
    width: 175,
    sort: (a: RowData['imageUploaded'], b: RowData['imageUploaded']) => (
      a === b ? 0 : b && !a ? 1 : -1
    )
  }]

  const [open, setOpen] = useState(true)

  return (
    <>
      <button onClick={() => setOpen(true)}>
        Open Drawer
      </button>
      <Drawer
        orientation='right'
        style='detached'
        open={open}
        onBackdropClicked={() => setOpen(false)}>
        <DrawerHeader
          title="Drawer"
          onClose={() => setOpen(false)}
        />
        <DrawerContent>
          <p>Test content</p>
        </DrawerContent>
      </Drawer>
      <div className='container'>
        <div style={{overflow: 'auto', marginTop: '16px'}}>
          <Table
            data={rows}
            columns={columns}
            selectable
            selectedActions={[{
              name: 'Delete',
              sentiment: 'negative',
              onClick: (selectedRows) => console.log(selectedRows)
            }]}
            onRowClick={(row) => console.log(row)}
            renderMap={(value) => {
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
              } else if ('imageUploaded' in value) {
                return value.imageUploaded ? (
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