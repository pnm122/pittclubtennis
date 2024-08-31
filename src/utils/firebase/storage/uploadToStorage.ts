import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"

export default async function uploadToStorage(path: string, data: Blob): FirebaseUtilityReturn<{
  downloadURL: string
}> {
  const storage = getStorage()

  try { 
    const newStorageRef = ref(storage, path)
    await uploadBytes(newStorageRef, data)
    const downloadURL = await getDownloadURL(newStorageRef)
    return {
      success: true,
      data: {
        downloadURL
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