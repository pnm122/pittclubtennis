import {
  collection,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import TournamentType from 'types/TournamentType'
import queryWithErrors from '../queryWithErrors'
import { FirebaseError } from 'firebase/app'

const getTournaments = async () => {
  const db = getFirestore()

  const q = await queryWithErrors<
    { data: TournamentType; doc: QueryDocumentSnapshot }[],
    FirebaseError
  >(async () => {
    const t = await getDocs(collection(db, 'TEST_tournaments'))
    const docs = t.docs
    let tournaments = docs.map(doc => {
      return {
        data: doc.data() as TournamentType,
        doc
      }
    })

    // Sort tournaments by last date to first date
    return tournaments.sort((t1, t2) => {
      return t2.data.dateStart.seconds - t1.data.dateStart.seconds
    })
  })

  return q
}

export default getTournaments
