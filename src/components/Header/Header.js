import React, { useEffect, useState } from 'react'
import styles from './Header.module.css'
import { Link } from 'react-router-dom'
import Links from 'components/Links/Links';

export default function Header({ selected }) {

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const setHeaderStyle = e => {
      let header = document.getElementById(styles.header)
      let hero = document.querySelector('.hero');

      // Change the style of header when scrolling into or out of the hero section so the header is readable for both
      let scrolled = window.scrollY > hero.scrollHeight - 70;
      let hasNotScrolledClass = header.classList.contains(styles.notScrolled)
      if(!scrolled && !hasNotScrolledClass) {
        header.classList.add(styles.notScrolled);
      } else if(scrolled && hasNotScrolledClass) {
        header.classList.remove(styles.notScrolled);
      }
    }

    // Add a scroll event listener to set the style of the header if the hero section exists (only exists on homepage)
    // This is because the header style is different for the homepage
    let hero = document.querySelector('.hero');
    if(hero) {
      document.addEventListener('scroll', setHeaderStyle);
    } else {
      document.getElementById(styles.header).classList.remove(styles.notScrolled)
    }

    // Add an increasing animation delay for each link in the header for the slide in on smaller screens
    const links = document.getElementById(styles.links);
    let delay = 0;
    for(let link of links.children) {
      link.style.animationDelay = `${delay}s`
      delay += 0.08;
    }

    return () => {
      document.removeEventListener('scroll', setHeaderStyle)
    }
  }, [])

  return (
    <header id={styles.header} className={styles.notScrolled}>
      <div className="container">
        <div id={styles.innerHeader}>
          <Link to="/"><img src='/images/pct_shield.webp' alt='PCT Shield'></img></Link>
          <nav id={styles.linksWrapper} aria-expanded={expanded}>
            <div id={styles.toggleLinks} onClick={() => setExpanded(!expanded)}>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <ul role='tablist' id={styles.links}>
              <Links selected={selected} />
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
