import { collection, getDocs, getFirestore } from 'firebase/firestore'
import queryWithErrors from './queryWithErrors'
import { FirebaseError } from 'firebase/app'
import FundraiserType from 'types/FundraiserType'

const getFundraisers = async () => {
  const db = getFirestore()

  const q = await queryWithErrors<FundraiserType[], FirebaseError>(async () => {
    const t = await getDocs(collection(db, 'fundraisers'))
    const docs = t.docs
    const fundraisers = docs.map(d => {
      return d.data() as FundraiserType
    })

    return fundraisers
  })

  return q
}

export default getFundraisers
