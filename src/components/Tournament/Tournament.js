import React from 'react'
import styles from './Tournament.module.css'
import { FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'
import NewTabLink from 'components/NewTabLink/NewTabLink'

export default function Tournament({ name, date, location, locationLink }) {
  return (
    <div id={styles.tournament}>
      <h4 id={styles.name}>{name}</h4>
      <div>
        <FaCalendar />
        <span>{date}</span>
      </div>
      <div id={styles.link}>
        <FaMapMarkerAlt />
        <NewTabLink href={locationLink} title={location}>{location}</NewTabLink>
      </div>
    </div>
  )
}
