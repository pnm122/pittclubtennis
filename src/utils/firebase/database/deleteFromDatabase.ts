import { deleteDoc, DocumentReference } from "firebase/firestore";

export default async function deleteFromDatabase(
  ref: DocumentReference
): FirebaseUtilityReturn<null> {
  try {
    await deleteDoc(ref)
    return {
      success: true,
      data: null
    }
  } catch(error) {
    return {
      success: false,
      data: {
        error
      }
    }
  }
}