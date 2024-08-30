import { collection, getDocs, getFirestore, QueryDocumentSnapshot } from "firebase/firestore"
import { StorageError } from 'firebase/storage'
import queryWithErrors from "./queryWithErrors"
import { FirebaseError } from "firebase/app"
import { MemberType } from "types/MemberType"

const getMembers = async () => {
  const db = getFirestore()

  return queryWithErrors<{ data: MemberType, doc: QueryDocumentSnapshot }[], FirebaseError | StorageError>(async () => {
    const m = await getDocs(collection(db, 'TEST_members'))
    const members = m.docs.map(doc => {
      return {
        data: doc.data() as unknown as MemberType,
        doc
      }
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

    return members.sort((a, b) => getSortOrder(b.data.role) - getSortOrder(a.data.role))
  })
}

export default getMembers