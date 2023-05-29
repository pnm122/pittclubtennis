import React, { useEffect } from 'react'
import styles from './HomePage.module.css'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

export default function HomePage() {

  const splitHeader = () => {
    let header = document.getElementById('hero-header');
    if(header.children.length > 0) return;

    const headerString = header.innerHTML;
    header.innerHTML = '';
    let del = 0;
    for(let char of headerString) {
      let s = document.createElement('span');
      if(char === ' ') s.innerHTML = '&nbsp;'
      else s.innerHTML = char;

      s.style.animationDelay = `${del}s`;
      header.appendChild(s);
      del += 0.05;
    }
  }

  useEffect(() => {
    splitHeader();

    const moveTennisBall = e => {
      let tennisBall = document.getElementById(styles.tennisBall)
      tennisBall.style.right = `calc(var(--right) - ${window.scrollY / 10}px)`
      tennisBall.style.top = `calc(var(--top) - ${window.scrollY / 50}px)`
    }

    document.addEventListener('scroll', moveTennisBall);

    return () => {
      document.removeEventListener('scroll', moveTennisBall)
    }
  }, [])

  return (
    <>
      <div id={styles.hero} className="section">
        <div id={styles.court}>
          <div className="container" id={styles.singles}>
            <div id={styles.serviceBoxes}></div>
            <div id={styles.heroContent}>
              <h1 id="hero-header">Pitt Club Tennis</h1>
              <p>We're a student-run competitive co-ed club sports team at the University of Pittsburgh.</p>
              <div id={styles.heroButtons}>
                <Link to="/tryouts" className="primary-button">Tryouts</Link>
                <Link to="/about" className="secondary-button">About Us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container section">
        <div id={styles.about}>
          <div id={styles.aboutImg}>
            <img id={styles.mainImg} src="/images/pct_img1.png" alt=''></img>
            <img id={styles.tennisBall} src="images/pct_tennisball.png" alt="Tennis Ball"></img>
            <div id={styles.dots}></div>
          </div>
          <div id={styles.aboutContent}>
            <h2>Our Club</h2>
            <p>Some text...</p>
            <Link to='/about' className="primary-button">About Us <FaArrowRight /></Link>
            <div id={styles.aboutNumbers}>
              <div>
                <h2>35</h2>
                <span>Members</span>
              </div>
              <div>
                <h2>3</h2>
                <span>Practices Per Week</span>
              </div>
              <div>
                <h2>2+</h2>
                <span>Tournaments Per Semester</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
