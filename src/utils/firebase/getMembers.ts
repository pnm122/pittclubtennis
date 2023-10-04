import { collection, getDocs, getFirestore } from "firebase/firestore"
import { StorageError, getDownloadURL, getStorage, ref } from 'firebase/storage'
import queryWithErrors from "./queryWithErrors"
import { FirebaseError } from "firebase/app"

const getMembers = async () => {
  const db = getFirestore()
  const storage = getStorage()

  return queryWithErrors<MemberType[], FirebaseError | StorageError>(async () => {
    const m = await getDocs(collection(db, 'members'))
    let members : MemberType[] = []
    for(const doc of m.docs) {
      let data = doc.data() as unknown as MemberType

      // Firebase imgSrc is a reference to where the image in storage is
      // get the download URL for that image, and then replace imgSrc
      if(data.imgSrc) data.imgSrc = await getDownloadURL(ref(storage, data.imgSrc))

      members.push(data)
    }

    // Sort members
    // President --> VP --> Business Manager --> Logistics Manager --> Social Chair --> Fundraising Chair --> Fundraising Committee
    let presidents : MemberType[] = []
    let vicePresidents : MemberType[] = []
    let business : MemberType[] = []
    let logistics : MemberType[] = []
    let socials : MemberType[] = []
    let fundChairs : MemberType[] = []
    let fundCommittee : MemberType[] = []
    let other : MemberType[] = []

    members.forEach(m => {
      switch(m.role) {
        case 'President':
          presidents.push(m)
          break
        case 'Vice President':
          vicePresidents.push(m)
          break
        case 'Business Manager':
          business.push(m)
          break
        case 'Logistics Manager':
          logistics.push(m)
          break
        case 'Social Chair':
          socials.push(m)
          break
        case 'Fundraising Chair':
          fundChairs.push(m)
          break
        case 'Fundraising Committee':
          fundCommittee.push(m)
          break
        default:
          other.push(m)
          break
      }
    })

    let sortedMembers : MemberType[] = []

    sortedMembers.push(...presidents)
    sortedMembers.push(...vicePresidents)
    sortedMembers.push(...business)
    sortedMembers.push(...logistics)
    sortedMembers.push(...socials)
    sortedMembers.push(...fundChairs)
    sortedMembers.push(...fundCommittee)
    sortedMembers.push(...other)
    
    return sortedMembers
  })
}

export default getMembers