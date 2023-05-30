import React from 'react'
import styles from './Footer.module.css'
import Links from 'components/Links/Links'
import NewTabLink from 'components/NewTabLink/NewTabLink'
import { FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'

export default function Footer({ selected }) {
  return (
    <div id={styles.footer}>
      <div className="container">
        <div id={styles.top}>
          <img src='/images/pct_logo.png' alt='PCT Logo'></img>
          <div id={styles.links}>
            <div>
              <h6>Links</h6>
              <ul role='tablist'>
                <Links selected={selected} />
              </ul>
            </div>
            <div>
              <h6>Contact</h6>
              <NewTabLink href="mailto:pittctt@gmail.com">pittctt@gmail.com</NewTabLink>
            </div>
          </div>
        </div>
        <div id={styles.bottom}>
          <div id={styles.bottomText}>
            <span id={styles.copyright}>Copyright ©{new Date().getFullYear()}</span>
            <span id={styles.designedBy}>Designed By <NewTabLink href="https://pierce-martin.com">Pierce Martin</NewTabLink></span>
          </div>
          <div id={styles.socials}>
            <NewTabLink href="#"><FaYoutube /></NewTabLink>
            <NewTabLink href="#"><FaInstagram /></NewTabLink>
            <NewTabLink href="#"><FaTiktok /></NewTabLink>
          </div>
        </div>
      </div>
    </div>
  )
}
