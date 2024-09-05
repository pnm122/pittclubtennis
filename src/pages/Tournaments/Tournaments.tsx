import { useContext, useEffect, useState } from 'react'
import styles from './Tournaments.module.css'
import TournamentType from 'types/TournamentType'
import getTournaments from 'utils/firebase/tournaments/getTournaments'
import Tournament, {
  TournamentSkeleton
} from 'components/Tournament/Tournament'
import filterUpcoming from 'utils/filterUpcoming'
import Skeleton from 'components/Skeleton/Skeleton'
import { notificationContext } from 'context/NotificationContext'

export default function Tournaments() {
  const [tournaments, setTournaments] = useState<TournamentType[] | null>(null)
  const [loading, setLoading] = useState(true)
  const { push: pushNotification } = useContext(notificationContext)

  useEffect(() => {
    getTournaments().then(res => {
      if (!res.data) {
        pushNotification({
          type: 'error',
          text: 'There was an error retrieving the tournaments.'
        })
        return
      }

      // Only show upcoming tournaments on the homepage
      setTournaments(res.data.map(d => d.data))
      setLoading(false)
    })
  }, [])

  let { upcoming, past } = filterUpcoming(tournaments)

  return (
    <main>
      <section>
        <div className='container two-cols'>
          <h2
            className='title'
            id={styles['title']}>
            Tournaments
          </h2>
          <div className='content fade-in'>
            <p>
              We attend as many tournaments as we can. Check out the tournaments
              we've played in and the ones we're going to attend!
            </p>
            <div id={styles['tournaments']}>
              {tournaments ? (
                <>
                  {upcoming ? (
                    <div className={styles['tournament-section']}>
                      <h3>Upcoming</h3>
                      <div>
                        {upcoming.map((t, index) => {
                          return (
                            <Tournament
                              key={index}
                              name={t.name}
                              dateStart={t.dateStart}
                              dateEnd={t.dateEnd}
                              locationName={t.locationName}
                              locationLink={t.locationLink}
                              placement={t.placement}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  {past ? (
                    <div className={styles['tournament-section']}>
                      <h3>Past Tournaments</h3>
                      <div>
                        {past.map((t, index) => {
                          return (
                            <Tournament
                              key={index}
                              name={t.name}
                              dateStart={t.dateStart}
                              dateEnd={t.dateEnd}
                              locationName={t.locationName}
                              locationLink={t.locationLink}
                              placement={t.placement}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : loading ? (
                <>
                  <div className={styles['tournament-section']}>
                    <Skeleton
                      width='225px'
                      height='var(--text-xl)'
                    />
                    <div>
                      <TournamentSkeleton />
                      <TournamentSkeleton />
                    </div>
                  </div>
                  <div className={styles['tournament-section']}>
                    <Skeleton
                      width='325px'
                      height='var(--text-xl)'
                    />
                    <div>
                      <TournamentSkeleton />
                      <TournamentSkeleton />
                      <TournamentSkeleton />
                      <TournamentSkeleton />
                    </div>
                  </div>
                </>
              ) : (
                <p>No tournaments found.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
