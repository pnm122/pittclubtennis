import { Timestamp } from "firebase/firestore"

export default interface TournamentType {
  name: string
  dateStart: Timestamp
  dateEnd: Timestamp
  locationName: string
  locationLink: string
  placement?: number
}