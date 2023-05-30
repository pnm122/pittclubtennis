import React from 'react'
import styles from './TournamentsPage.module.css'
import Page from 'components/Page/Page'
import upcomingTournaments from 'data/upcomingTournaments.json'
import previousTournaments from 'data/previousTournaments.json'
import Tournament from 'components/Tournament/Tournament';
import useScroll from 'hooks/useScroll'

export default function TournamentsPage() {
  useScroll();
  const title = "Tournaments";

  return (
    <Page title={title}>
      <div className="container section">
        <div id={styles.upcoming}>
          <h2>Upcoming</h2>
          { upcomingTournaments.map(t => {
            return <Tournament key={t.id} name={t.name} date={t.date} location={t.location} locationLink={t.locationLink} />
          }) }
        </div>
      </div>
      <div className="container section">
        <div id={styles.past}>
          <h2>Past</h2>
          { previousTournaments.map(t => {
            return <Tournament key={t.id} name={t.name} date={t.date} location={t.location} locationLink={t.locationLink} result={t.result} />
          }) }
        </div>
      </div>
    </Page>
  )
}
