import { collection, getDocs, getFirestore } from "firebase/firestore"
import { StorageError, getDownloadURL, getStorage, ref } from 'firebase/storage'
import queryWithErrors from "./queryWithErrors"
import { FirebaseError } from "firebase/app"

const getMembers = async (options?: { getDownloadURLs: boolean }) => {
  const db = getFirestore()
  const storage = getStorage()

  return queryWithErrors<MemberType[], FirebaseError | StorageError>(async () => {
    const m = await getDocs(collection(db, 'members'))
    const members = m.docs.map(doc => {
      return doc.data() as unknown as MemberType
    })

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