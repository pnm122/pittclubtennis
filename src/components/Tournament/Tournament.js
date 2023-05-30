import React from 'react'
import styles from './Tournament.module.css'
import { FaCalendar, FaMapMarkerAlt, FaTrophy } from 'react-icons/fa'
import NewTabLink from 'components/NewTabLink/NewTabLink'

export default function Tournament({ name, date, location, locationLink, result }) {
  let resultStyle;
  if(result && result.includes('1st')) resultStyle = styles.gold;
  else if(result && result.includes('2nd')) resultStyle = styles.silver;
  else if(result && result.includes('3rd')) resultStyle = styles.bronze;

  return (
    <div id={styles.tournament} className={ resultStyle }>
      <h4 id={styles.name}>{name}</h4>
      <div>
        <FaCalendar />
        <span>{date}</span>
      </div>
      <div id={styles.link}>
        <FaMapMarkerAlt />
        <NewTabLink href={locationLink} title={location}>{location}</NewTabLink>
      </div>
      { result ? (
        <div id={styles.result}>
          <FaTrophy />
          <span>{result}</span>
        </div>
      ) : null }
    </div>
  )
}
