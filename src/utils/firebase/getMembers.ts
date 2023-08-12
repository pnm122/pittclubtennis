import { collection, getDocs, getFirestore } from "firebase/firestore"
import { StorageError, getDownloadURL, getStorage, ref } from 'firebase/storage'
import queryWithErrors from "./queryWithErrors"
import { FirebaseError } from "firebase/app"

const getMembers = async () => {
  const db = getFirestore()
  const storage = getStorage()

  return queryWithErrors<MemberType[], FirebaseError | StorageError>(async () => {
    const m = await getDocs(collection(db, 'members'))
    let members : MemberType[] = []
    for(const doc of m.docs) {
      let data = doc.data() as unknown as MemberType

      // Firebase imgSrc is a reference to where the image in storage is
      // get the download URL for that image, and then replace imgSrc
      data.imgSrc = await getDownloadURL(ref(storage, data.imgSrc))

      members.push(data)
    }

    // TODO: sort members
    
    return members
  })
}

export default getMembers