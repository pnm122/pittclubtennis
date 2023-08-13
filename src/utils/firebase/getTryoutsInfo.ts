import { FirestoreError, doc, getDoc, getFirestore } from "firebase/firestore"
import queryWithErrors from "./queryWithErrors"
import TryoutsType from "types/TryoutsType"

const getTryoutsInfo = () => {
  const db = getFirestore()

  return queryWithErrors<TryoutsType, FirestoreError>(async () => {
    const d = await getDoc(doc(db, 'tryouts', 'tryouts-info'))

    return d.data() as TryoutsType
  })
}

export default getTryoutsInfo