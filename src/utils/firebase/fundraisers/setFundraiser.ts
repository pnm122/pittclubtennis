import { QueryDocumentSnapshot } from 'firebase/firestore'
import updateInDatabase from '../database/updateInDatabase'
import addToDatabase from '../database/addToDatabase'
import FundraiserType from 'types/FundraiserType'

export default async function setFundraiser(
  data: FundraiserType,
  doc?: QueryDocumentSnapshot
): FirebaseUtilityReturn<null> {
  if (doc) {
    const updateRes = await updateInDatabase(doc.ref, data)
    if (!updateRes.success) {
      return updateRes
    }
  } else {
    const addRes = await addToDatabase('fundraisers', data)
    if (!addRes.success) {
      return addRes
    }
  }

  return { success: true, data: null }
}
