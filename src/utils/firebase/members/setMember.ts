import { deleteField, getDoc, QueryDocumentSnapshot } from 'firebase/firestore'
import { MemberType, SetMemberType } from 'types/MemberType'
import uploadToStorage from '../storage/uploadToStorage'
import deleteFromStorage from '../storage/deleteFromStorage'
import updateInDatabase from '../database/updateInDatabase'
import addToDatabase from '../database/addToDatabase'

export default async function setMember(
  data: SetMemberType,
  doc?: QueryDocumentSnapshot
): FirebaseUtilityReturn<null> {
  let newData: Record<string, any> = {
    name: data.name,
    role: data.role,
    year: data.year
  }

  // upload a new image if it exists, updating newData
  async function maybeUploadNewImage() {
    if (data.image.source === 'local' && data.image.data) {
      const uploadRes = await uploadToStorage(
        `TEST_members/${data.name}`,
        data.image.data
      )

      if (!uploadRes.success) {
        return uploadRes
      }

      newData.imgSrc = uploadRes.data.downloadURL
      console.log('uploaded new image to:', newData.imgSrc)
      return uploadRes
    }
  }

  if (doc) {
    const oldData = (await getDoc(doc.ref)).data() as MemberType

    // if the member currently has an image and the new source is local, delete the old image
    if (oldData.imgSrc && data.image.source === 'local') {
      const deleteRes = await deleteFromStorage(oldData.imgSrc)
      if (!deleteRes.success) {
        return deleteRes
      }
      // Has to be marked with deleteField() because simply calling updateDoc() without the imgSrc field will not delete the field
      newData.imgSrc = deleteField()
      console.log('deleted old image:', deleteRes.data.deletedRef.fullPath)
    }

    const uploadRes = await maybeUploadNewImage()
    if (uploadRes && !uploadRes.success) {
      return uploadRes
    }

    const updateRes = await updateInDatabase(doc.ref, newData)
    if (!updateRes.success) {
      return updateRes
    }
    console.log('updated document to:', newData)
  } else {
    const uploadRes = await maybeUploadNewImage()
    if (uploadRes && !uploadRes.success) {
      return uploadRes
    }

    const addRes = await addToDatabase('TEST_members', newData)
    if (!addRes.success) {
      return addRes
    }
    console.log('added document:', newData)
  }

  return { success: true, data: null }
}
