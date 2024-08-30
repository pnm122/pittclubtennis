import { deleteField, getDoc, getFirestore, QueryDocumentSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { MemberType, SetMemberType } from "types/MemberType";

export default async function setMember(data: SetMemberType, doc?: QueryDocumentSnapshot) {
  const db = getFirestore()
  const storage = getStorage()

  if(doc) {
    const oldData = (await getDoc(doc.ref)).data() as MemberType
    let newData: Record<string, any> = { name: data.name, role: data.role, year: data.year }

    // if the member currently has an image and the new source is local, delete the old image
    if(oldData.imgSrc && data.image.source === 'local') {
      const oldImageRef = ref(storage, oldData.imgSrc)
      await deleteObject(oldImageRef)
      // Has to be marked with deleteField() because simply calling updateDoc() without the imgSrc field will not delete the field
      newData.imgSrc = deleteField()
      console.log('deleted old image:', oldImageRef.fullPath)
    }

    // upload a new image if it exists
    if(data.image.source === 'local' && data.image.data) {
      const newStorageRef = ref(storage, `TEST_members/${data.name}`)
      await uploadBytes(newStorageRef, data.image.data)
      newData.imgSrc = await getDownloadURL(newStorageRef)
      console.log('uploaded new image to:', newData.imgSrc)
    }
    
    await updateDoc(doc.ref, newData)
    console.log('updated document to:', newData)
  }

  return { success: true }
}