import React from 'react'
import styles from './Member.module.css'

export default function Member({ name, position, picture, bio }) {
  return (
    <div className={styles.member}>
      <div 
        className={styles.imgWrapper}
        style={{
          backgroundImage: `url(${picture})`
        }}></div>
      <div className={`${styles.memberInfo} ${position ? styles.board : null}`}>
        <h4>{name}</h4>
        {position ? <span className={styles.position}>{position}</span> : null}
      </div>
    </div>
  )
}
