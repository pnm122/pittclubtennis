import React, { useEffect } from 'react'
import styles from './HomePage.module.css'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import Tournament from 'components/Tournament/Tournament'
import Header from 'components/Header/Header'

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
      tennisBall.style.right = `calc(var(--right) - ${window.scrollY / 8}px)`
      tennisBall.style.top = `calc(var(--top) - ${window.scrollY / 40}px)`
      tennisBall.style.transform = `rotate(${(window.scrollY / 12) - 20}deg)`
    }

    document.addEventListener('scroll', moveTennisBall);

    return () => {
      document.removeEventListener('scroll', moveTennisBall)
    }
  }, [])

  return (
    <>
      <Header />
      <div id={styles.hero} className="section hero">
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
            <p>On September 14th, 2006, the Pittsburgh Club Tennis Team was born, holding its first tryout and marking the beginning of a new, 
              competitive club sport at the University of Pittsburgh. Since then, Pitt Club Tennis has grown tremendously. Today, we have roughly 
              35 members, hold practices 3 times a week at Alpha Tennis and Fitness, and attend tournaments all across the nation!</p>
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
      <div className="container section">
        <div id={styles.tournaments}>
          <h2>Upcoming Tournaments</h2>
          <Tournament name="Hershey" date="2/17 - 2/18" location="Hershey Racquet Club" locationLink="https://www.google.com/maps/place/Hershey+Racquet+Club/@40.2699664,-76.6749489,17z/data=!3m1!4b1!4m6!3m5!1s0x89c8bb63a19d7eed:0x915e2292e4faa1cf!8m2!3d40.2699664!4d-76.6727602!16s%2Fg%2F1tgnsmlv?entry=ttu" />
          <Tournament name="Nationals" date="4/6 - 4/8" location="Surprise Tennis and Racquet Complex" locationLink="https://www.google.com/maps/place/Surprise+Tennis+%26+Racquet+Complex/@33.6297222,-112.3738554,17z/data=!3m1!4b1!4m6!3m5!1s0x872b44dae2b9635f:0x90bdbef88f5f4502!8m2!3d33.6297222!4d-112.3716667!16s%2Fg%2F1tykvvvb?entry=ttu" />
          <Link to="/tournaments" className="primary-button">See all tournaments <FaArrowRight /></Link>
        </div>
      </div>
    </>
  )
}
