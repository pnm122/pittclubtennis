import styles from '../Admin.module.css'
import Table from 'components/Table/Table'
import { Column } from 'types/Table'
import createClasses from 'utils/createClasses'
import { getRoleColors } from 'utils/getRoleColors'
import { IoMdCheckmark } from 'react-icons/io'
import { useRef, useState } from 'react'
import { AdminMemberDrawer } from 'types/AdminMembers'
import Input from 'components/Input/Input'
import Select from 'components/Select/Select'
import Datepicker from 'components/Datepicker/Datepicker'
import { isWeekend } from 'date-fns'
import FileDropper, { FileDropperRef } from 'components/FileDropper/FileDropper'
import MemberDrawer, { MemberDrawerRef } from '../Members/MemberDrawer'

export default function Edit() {
  const memberDrawer = useRef<MemberDrawerRef>(null)

  type RowData = Readonly<MemberType & { key: any }>
  
  const rows: RowData[] = [{
    key: 1,
    name: 'Chris Perry',
    year: 'senior',
    role: 'President',
    imgSrc: 'a'
  }, {
    key: 2,
    name: 'Irene Yang',
    year: 'senior',
    role: 'President',
    imgSrc: 'a'
  }, {
    key: 6,
    name: 'Alex Kufner',
    year: 'junior',
    role: 'Vice President',
    imgSrc: ''
  }, {
    key: 7,
    name: 'Olivia Dodge',
    year: 'senior',
    role: 'Business Manager',
    imgSrc: 'a'
  }, {
    key: 8,
    name: 'Rohan Krishnan',
    year: 'senior',
    role: 'Logistics Manager',
    imgSrc: ''
  }, {
    key: 3,
    name: 'Pierce Martin',
    year: 'senior',
    role: 'Social Chair',
    imgSrc: 'a'
  }, {
    key: 4,
    name: 'Ashley Belous',
    year: 'sophomore',
    role: 'Social Chair',
    imgSrc: 'a'
  }, {
    key: 9,
    name: 'Jonah Osband',
    year: 'senior',
    role: 'Fundraising Chair',
    imgSrc: 'a'
  }, {
    key: 10,
    name: 'Amanda Santora',
    year: 'junior',
    role: 'Fundraising Committee',
    imgSrc: 'a'
  }, {
    key: 5,
    name: 'Riya Shah',
    year: 'sophomore',
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
    key: 'imgSrc',
    name: 'Image Uploaded',
    width: 175,
    sort: (a: RowData['imgSrc'], b: RowData['imgSrc']) => (
      a === b ? 0 : b && !a ? 1 : -1
    )
  }]

  const openEditDrawer = (row: RowData) => {
    memberDrawer.current?.open({
      data: row,
      type: 'edit'
    })
  }

  const selectOptions = ['test', 'another', 'last']
  const [selectValue, setSelectValue] = useState<number | null>(null)

  const [datepickerValue, setDatepickerValue] = useState<Date | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const fileDropper = useRef<FileDropperRef>(null)

  return (
    <>
      <MemberDrawer
        ref={memberDrawer}
        onSave={(data) => console.log(data)}
      />
      <div className='container'>
        <div style={{ paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Input
            label='Input'
            value=''
            placeholder='Placeholder...'
            name='input'
            onChange={() => {}}
            width='150px'
          />
          <Select
            options={selectOptions}
            value={selectValue}
            onChange={({ index }) => setSelectValue(index)}
            width='150px'
            label='Select'
          />
          <Datepicker
            label='Datepicker'
            width='150px'
            value={datepickerValue}
            onChange={(date) => { console.log(date); setDatepickerValue(date); }}
            disabledDates={(d) => isWeekend(d)}
          />
          <FileDropper
            acceptedFileTypes={['image/png', 'image/jpeg']}
            name='file-dropper'
            label='File Dropper'
            onFileError={(error) => console.log(error)}
            value={file}
            onChange={async (f) => {
              setFile(f)
              // const data = await fileDropper.current?.getFileData()
            }}
            maxFileSize={1024 * 1024 * 4}
            ref={fileDropper}
          />
        </div>
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