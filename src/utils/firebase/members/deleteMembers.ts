import { QueryDocumentSnapshot } from "firebase/firestore";
import deleteFromStorage from "../storage/deleteFromStorage";
import { MemberType } from "types/MemberType";
import deleteFromDatabase from "../database/deleteFromDatabase";

export default async function deleteMembers(docs: QueryDocumentSnapshot[]): FirebaseUtilityReturn<null> {
  const promises = docs.map(doc => (async (): FirebaseUtilityReturn<null> => {
    const data = doc.data() as MemberType
    if(data.imgSrc) {
      console.log('deleting image for:', data.name)
      const deleteRes = await deleteFromStorage(data.imgSrc)

      if(!deleteRes.success) {
        return deleteRes
      }
    }

    console.log('deleting data for:', data.name)
    const deleteRes = await deleteFromDatabase(doc.ref)
    return deleteRes
  })())

  const results = await Promise.all(promises)
  console.log('finished deleting')
  const errors = results.filter(res => !res.success).map(f => f.data.error)
  if(errors.length !== 0) {
    return {
      success: false,
      data: {
        error: errors
      }
    }
  }

  return {
    success: true,
    data: null
  }
}