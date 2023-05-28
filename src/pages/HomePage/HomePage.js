import React from 'react'
import styles from './HomePage.module.css'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div id={styles.hero}>
      <div id={styles.court}>
        <div className="container" id={styles.singles}>
          <div id={styles.serviceBoxes}></div>
          <div id={styles.heroContent}>
            <h1>Pitt Club Tennis</h1>
            <p>We're a student-run competitive co-ed club sports team at the University of Pittsburgh.</p>
            <div id={styles.heroButtons}>
              <Link to="/tryouts" className="primary-button">Tryouts</Link>
              <Link to="/about" className="secondary-button">About Us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
