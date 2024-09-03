import { QueryDocumentSnapshot } from 'firebase/firestore'
import updateInDatabase from '../database/updateInDatabase'
import addToDatabase from '../database/addToDatabase'
import TournamentType from 'types/TournamentType'

export default async function setTournament(
  data: TournamentType,
  doc?: QueryDocumentSnapshot
): FirebaseUtilityReturn<null> {
  if (doc) {
    const updateRes = await updateInDatabase(doc.ref, data)
    if (!updateRes.success) {
      return updateRes
    }
  } else {
    const addRes = await addToDatabase('TEST_tournaments', data)
    if (!addRes.success) {
      return addRes
    }
  }

  return { success: true, data: null }
}
