import styles from './Homepage.module.css'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import SplitType from 'split-type'
import { gsap } from 'gsap'
import AnimatedLink from 'components/AnimatedLink/AnimatedLink'
import getTournaments from 'utils/firebase/getTournaments'
import TournamentType from 'types/TournamentType'
import Tournament, { TournamentSkeleton } from 'components/Tournament/Tournament'
import filterUpcoming from 'utils/filterUpcoming'
import { textFrom, textTo } from 'utils/animation/textAnimation'
import { fadeFrom, fadeTo } from 'utils/animation/fadeAnimation'

export default function Homepage() {
  return (
    <main>
      <Hero />
      <About />
      <Tournaments />
    </main>
  )
}

const Hero = () => {
  const tennisball = useRef<HTMLImageElement | null>(null)
  const hero = useRef<HTMLDivElement | null>(null)
  const tl = useRef<GSAPTimeline | null>()

  useLayoutEffect(() => {
    if(!hero.current) return

    window.onscroll = () => {
      if(!tennisball.current) return

      const x = -1 * (window.scrollY / 4.5)
      const y = -1 * (window.scrollY / 12)

      tennisball.current.style.transform = `translate(${x}px, ${y}px)`
    }

    // Recommended way of using GSAP with React
    // Create a context that's scoped within the hero ref, which is
    // cleaned up when the component unmounts
    let ctx = gsap.context(() => {
      tl.current = gsap.timeline()

      const splitText = new SplitType('.hero-text.split', {
        wordClass: 'no-overflow'
      })

      tl.current.fromTo(splitText.chars, textFrom, textTo)

      tl.current.fromTo(`.hero-fade-in`, fadeFrom, fadeTo)
    }, hero.current)

    return () => ctx.revert()
  }, [hero.current])

  return (
    <section id={styles['hero-wrapper']} className='hero'>
      <div 
        id={styles['hero']} 
        className='container'
        ref={hero}>
        <div id={styles['hero-content']}>
          <h1 className='hero-text split'>Club Tennis at Pitt</h1>
          <p className='hero-fade-in'>We're a student-run competitive co-ed club sports team
            at the University of Pittsburgh.
          </p>
          <div id={styles['hero-buttons']}>
            <AnimatedLink to='/tryouts' text='Join' className='primary-button large hero-fade-in'></AnimatedLink>
            <AnimatedLink to='/about' text='About Us' className='secondary-button large hero-fade-in'></AnimatedLink>
          </div>
        </div>
        <div id={styles['hero-img-wrap']}>
          <img 
            src='images/hero.png' 
            alt='Player hitting a ball'
            id={styles['hero-img']}
            className='hero-fade-in'
          />
          <img 
            src='images/tennisball.png' 
            alt='Tennis ball'
            ref={tennisball}
            id={styles['tennis-ball']}
            className='hero-fade-in'
          />
        </div>
      </div>
    </section>
  )
}

const About = () => {
  return (
    <section>
      <div id={styles['about']} className='container two-cols'>
        <h2 className='title'>Our Club</h2>
        <div className='content fade-in'>
          <div id={styles['about-paragraph']}>
            <p>On September 14th, 2006, the Pittsburgh Club Tennis Team was born, holding 
              its first tryout and marking the beginning of a new, competitive club sport 
              at the University of Pittsburgh. Since then, Pitt Club Tennis has grown 
              tremendously. Today, we have roughly 35 members, hold practices 3 times a 
              week at Alpha Tennis and Fitness, and attend tournaments all across the 
              nation!</p>
            <AnimatedLink 
              to='/about' 
              text='Learn More' 
              className='primary-button'
            />
          </div>
        </div>
      </div>
    </section>
  )
}

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<TournamentType[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTournaments().then(res => {
      if(!res.data) {
        console.error(res.error)
        return
      }

      // Only show upcoming tournaments on the homepage
      setTournaments(filterUpcoming(res.data).upcoming)
      setLoading(false)
    })
  }, [])

  return (
    <section>
      <div className='container two-cols'>
        <h2 className='title'>Upcoming Tournaments</h2>
        <div className='content fade-in'>
          <div>
            { tournaments ? (
              tournaments.map((t, index) => {
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
              })
            ) : (
              loading ? (
                <>
                  <TournamentSkeleton />
                  <TournamentSkeleton />
                </>
              ) : (
                <p>No upcoming tournaments.</p>
              )
            )}
          </div>
          <AnimatedLink to='/tournaments' text='See All Tournaments' className='primary-button' />
        </div>
      </div>
    </section>
  )
}