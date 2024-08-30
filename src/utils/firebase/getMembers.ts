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
      if(data.imgSrc) data.imgSrc = await getDownloadURL(ref(storage, data.imgSrc))

      members.push(data)
    }

    const sortOrder = {
      'FUNDRAISING COMMITTEE': 1,
      'FUNDRAISING CHAIR': 2,
      'SOCIAL CHAIR': 3,
      'LOGISTICS MANAGER': 4,
      'BUSINESS MANAGER': 5,
      'VICE PRESIDENT': 6,
      'PRESIDENT': 7
    } as const

    function getSortOrder(role: string | undefined) {
      if(!role) return -1

      const order = sortOrder[role.toUpperCase() as keyof typeof sortOrder]
      if(!order) return -1
      return order
    }

    return members.sort((a, b) => getSortOrder(b.role) - getSortOrder(a.role))
  })
}

export default getMembers