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
    width: 175
  }, {
    key: 'imageUploaded',
    name: 'Image Uploaded',
    width: 175,
    sort: (a: RowData['imageUploaded'], b: RowData['imageUploaded']) => (
      a === b ? 0 : b && !a ? 1 : -1
    )
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
        selectedActions={[{
          name: 'Delete',
          sentiment: 'negative',
          onClick: (selectedRows) => console.log(selectedRows)
        }]}
        // renderMap={(value) => {
        //   return Object.keys(value).map(key => <div>{value[key].toString()}</div>)[0]
        // }}
      />
    </div>
  )
}