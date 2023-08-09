import TournamentType from "types/TournamentType"
import styles from './Tournament.module.css'
import { RxExternalLink } from 'react-icons/rx'

export default function Tournament({
  name,
  dateStart,
  dateEnd,
  locationName,
  locationLink,
  placement
} : TournamentType) {
  // Remove the day from the date
  const dS = new Date(dateStart.seconds * 1000).toDateString().substring(4)
  const dE = new Date(dateEnd.seconds * 1000).toDateString().substring(4)

  return (
    <div id={styles['tournament']}>
      <div>
        <h3>{name}</h3>
        <span>{dS} - {dE}</span>
      </div>
      <a href={locationLink}>{locationName} <RxExternalLink /></a>
    </div>
  )
}
