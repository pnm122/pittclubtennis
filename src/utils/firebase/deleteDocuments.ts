import { QueryDocumentSnapshot } from 'firebase/firestore'
import deleteFromDatabase from './database/deleteFromDatabase'

export default async function deleteDocuments(
  docs: QueryDocumentSnapshot[]
): FirebaseUtilityReturn<null> {
  const promises = docs.map(doc =>
    (async (): FirebaseUtilityReturn<null> => {
      const deleteRes = await deleteFromDatabase(doc.ref)
      return deleteRes
    })()
  )

  const results = await Promise.all(promises)

  const errors = results.filter(res => !res.success).map(f => f.data.error)
  if (errors.length !== 0) {
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
