import { Timestamp } from "firebase/firestore"

export default interface FundraiserType {
  name: string
  description: string
  linkTitle: string
  linkLocation: string
  endDate: Timestamp
}
