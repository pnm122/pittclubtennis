import { collection, getDocs, getFirestore, QueryDocumentSnapshot } from 'firebase/firestore'
import queryWithErrors from '../queryWithErrors'
import { FirebaseError } from 'firebase/app'
import FundraiserType from 'types/FundraiserType'

const getFundraisers = async () => {
  const db = getFirestore()

  const q = await queryWithErrors<{ data: FundraiserType, doc: QueryDocumentSnapshot }[], FirebaseError>(async () => {
    const t = await getDocs(collection(db, 'TEST_fundraisers'))
    const docs = t.docs
    const fundraisers = docs.map(doc => {
      return {
        data: doc.data() as FundraiserType,
        doc
      }
    })

    return fundraisers
  })

  return q
}

export default getFundraisers
