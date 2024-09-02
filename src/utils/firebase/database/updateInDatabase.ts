import { DocumentReference, updateDoc } from 'firebase/firestore'

export default async function updateInDatabase<T extends Record<string, any>>(
  ref: DocumentReference,
  data: T
): FirebaseUtilityReturn<null> {
  try {
    await updateDoc(ref, data)
    return {
      success: true,
      data: null
    }
  } catch (error) {
    return {
      success: false,
      data: {
        error
      }
    }
  }
}
