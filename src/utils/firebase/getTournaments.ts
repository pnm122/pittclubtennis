import { collection, getDocs, getFirestore } from 'firebase/firestore'
import TournamentType from 'types/TournamentType'
import queryWithErrors from './queryWithErrors'
import { FirebaseError } from 'firebase/app'

const getTournaments = async () => {
  const db = getFirestore()

  const q = await queryWithErrors<TournamentType[], FirebaseError>(async () => {
    const t = await getDocs(collection(db, 'tournaments'))
    const docs = t.docs
    let tournaments = docs.map(d => {
      return d.data() as TournamentType
    })

    // Sort tournaments by most recent first
    tournaments = tournaments.sort((t1, t2) => {
      return t2.dateStart.seconds - t1.dateStart.seconds
    })

    return tournaments
  })

  return q
}

export default getTournaments