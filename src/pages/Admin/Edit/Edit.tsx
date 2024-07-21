import { getAuth } from 'firebase/auth'
import styles from '../Admin.module.css'
import Table from 'components/Table/Table'
import { Column } from 'types/Table'

export default function Edit() {
  const auth = getAuth()

  const logOut = async () => {
    try {
      await auth.signOut()
    } catch(e) {
      console.error(e)
    }
  }

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
    year: 'Senior',
    role: 'President',
    imageUploaded: true
  }, {
    key: 2,
    name: 'Irene Yang',
    year: 'Senior',
    role: 'President',
    imageUploaded: true
  }, {
    key: 3,
    name: 'Pierce Martin',
    year: 'Senior',
    role: 'Social Chair',
    imageUploaded: true
  }, {
    key: 4,
    name: 'Ashley Belous',
    year: 'Sophomore',
    role: 'Social Chair',
    imageUploaded: true
  }]

  const columns: Column<RowData>[] = [{
    key: 'name',
    name: 'Name',
    width: 175,
    sort: (a: RowData['name'], b: RowData['name']) => a.localeCompare(b)
  }, {
    key: 'year',
    name: 'Year',
    width: 125
  }, {
    key: 'role',
    name: 'Role',
    width: 150
  }, {
    key: 'imageUploaded',
    name: 'Image Uploaded',
    width: 125
  }]

  return (
    <div>
      <button
        onClick={logOut}>
        Log Out
      </button>
      <Table
        data={rows}
        columns={columns}
        // renderMap={(value) => {
        //   return Object.keys(value).map(key => <div>{value[key].toString()}</div>)[0]
        // }}
      />
    </div>
  )
}