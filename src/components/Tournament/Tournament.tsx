import TournamentType from "types/TournamentType"
import styles from './Tournament.module.css'
import { RxExternalLink } from 'react-icons/rx'
import Skeleton from "components/Skeleton/Skeleton"

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

export function TournamentSkeleton() {
  return (
    <div id={styles['tournament-skeleton']}>
      <div id={styles['skeleton-title']}>
        <Skeleton width='160px' height='var(--text-lg)' />
        <Skeleton width='200px' height='var(--text-md)' />
      </div>
      <Skeleton width='120px' height='var(--text-md)' />
    </div>
  )
}
