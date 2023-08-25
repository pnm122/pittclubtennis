import NotificationType from "types/NotificationType"
import queryWithErrors from "./queryWithErrors"
import { FirebaseError } from "firebase/app"
import { doc, getDoc, getFirestore } from "firebase/firestore"

const getNotification = () => {
  return queryWithErrors<NotificationType, FirebaseError>(async () => {
    const db = getFirestore()
    const d = await getDoc(doc(db, 'notification', 'data'))
    const data = d.data() as NotificationType

    return data
  })
}

export default getNotification