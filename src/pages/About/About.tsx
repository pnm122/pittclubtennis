import styles from './About.module.css'

export default function About() {
  return (
    <main>
      <section>
        <div className='container two-cols'>
          <h2 className='title'>About Us</h2>
          <div className='content fade-in'>
            <div>
              <h5>Our History</h5>
              <p>
                On September 14th, 2006, the Pittsburgh Club Tennis Team was born, holding its 
                first tryout and marking the beginning of a new, competitive club sport at the 
                University of Pittsburgh. In its first year, 30 people tried out for 15 spots 
                on the co-ed team, however they only saw one match.
              </p>
              <p>The 2007-2008 season brought a larger roster size and more match play. The 
                team began to practice more frequently, and a part-time coach was even hired 
                using the players dues. Since this season, Club Tennis at Pitt has grown into 
                a well-established club and a close-knit family.
              </p>
            </div>
            <div>
              <h5>Today</h5>
              <p>Today, Club Tennis at Pitt holds about 35 members, with nearly 100 players 
                trying out each year. We travel to multiple tournaments each semester, regularly 
                visiting tournaments both in-state and out-of-state. Tournaments are not 
                mandatory, though we highly encourage our players to go if they are able. 
                We practice Tuesday, Wednesday, and Thursday from 9-11pm at <a 
                  href="https://alphatennis.net/" 
                  target='_blank' 
                  rel='noopener noreferrer'
                  className='inline'>
                  Alpha Tennis and Fitness
                </a>. 
                Since practices are off-campus, we ask those on the team with cars to 
                get players to and from practices. However, tournaments, practices, and other 
                team expenses add up over time. Pitt covers some of our costs, but we have to 
                make up the difference ourselves. We achieve this with fundraising, donations, 
                and player dues, which are currently $225 per player per semester.
              </p>
            </div>
            <div>
              <h5>Learn More</h5>
              <p>
                If you'd like to get in contact with us, either email us at <a 
                  href='mailto:pittctt@gmail.com' 
                  className='inline'>
                  pittctt@gmail.com
                </a> or DM us on <a
                  href='https://www.instagram.com/clubtennisatpitt/' 
                  target='_blank' 
                  rel='noopener noreferrer'
                  className='inline'>
                  Instagram
                </a>. 
                We'll also be at the Activity Fair in the Cathedral of Learning lawn on 
                September 26th from 12-3PM!
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
