import { addDoc, collection, DocumentReference, getFirestore } from "firebase/firestore";

export default async function addToDatabase<T extends Record<string, any>>(
  collectionName: string,
  data: T
): FirebaseUtilityReturn<{ doc: DocumentReference }> {
  const db = getFirestore()
  try {
    const doc = await addDoc(collection(db, collectionName), data)
    return {
      success: true,
      data: {
        doc
      }
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