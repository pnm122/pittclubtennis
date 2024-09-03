import { DocumentSnapshot, FirestoreError, doc, getDoc, getFirestore } from 'firebase/firestore'
import queryWithErrors from './queryWithErrors'
import TryoutsType from 'types/TryoutsType'

const getTryoutsInfo = () => {
  const db = getFirestore()

  return queryWithErrors<{ data: TryoutsType, doc: DocumentSnapshot }, FirestoreError>(async () => {
    const d = await getDoc(doc(db, 'tryouts', 'tryouts-info'))

    return {
      data: d.data() as TryoutsType,
      doc: d
    }
  })
}

export default getTryoutsInfo
