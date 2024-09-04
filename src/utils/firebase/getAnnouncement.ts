import AnnouncementType from 'types/AnnouncementType'
import queryWithErrors from './queryWithErrors'
import { FirebaseError } from 'firebase/app'
import { doc, DocumentSnapshot, getDoc, getFirestore } from 'firebase/firestore'

const getAnnouncement = () => {
  return queryWithErrors<{ data: AnnouncementType, doc: DocumentSnapshot }, FirebaseError>(async () => {
    const db = getFirestore()
    const d = await getDoc(doc(db, 'announcement', 'data'))

    return {
      data: d.data() as AnnouncementType,
      doc: d
    }
  })
}

export default getAnnouncement
