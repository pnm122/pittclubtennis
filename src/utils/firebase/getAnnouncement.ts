import AnnouncementType from 'types/AnnouncementType'
import queryWithErrors from './queryWithErrors'
import { FirebaseError } from 'firebase/app'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

const getAnnouncement = () => {
  return queryWithErrors<AnnouncementType, FirebaseError>(async () => {
    const db = getFirestore()
    const d = await getDoc(doc(db, 'announcement', 'data'))
    const data = d.data() as AnnouncementType

    return data
  })
}

export default getAnnouncement
