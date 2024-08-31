import { deleteObject, getStorage, ref, StorageReference } from "firebase/storage";

export default async function deleteFromStorage(path: string): FirebaseUtilityReturn<{ deletedRef: StorageReference }> {
  const storage = getStorage()

  try {
    const deletedRef = ref(storage, path)
    await deleteObject(deletedRef)
    return { success: true, data: { deletedRef } }
  } catch(error) {
    return {
      success: false,
      data: {
        error
      }
    }
  }
}