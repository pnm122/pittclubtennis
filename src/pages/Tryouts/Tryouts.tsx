import TryoutsType from 'types/TryoutsType'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import { useEffect, useState } from 'react'
import getTryoutsInfo from 'utils/firebase/getTryoutsInfo'

export default function Tryouts() {
  const [tryoutsInfo, setTryoutsInfo] = useState<TryoutsType | null>(null)

  useEffect(() => {
    getTryoutsInfo().then(res => {
      if(res.error || !res.data) {
        return
      }

      setTryoutsInfo(res.data)
    })
  }, [])

  return (
    <main>
      <section>
        <div className='container two-cols'>
          <h2 className='title'>Tryouts</h2>
          <div className='content fade-in'>
            <div>
              <h5>Overview</h5>
              <p>Club Tennis at Pitt is a competitive organization with limited space, so we use 
                tryouts to select the best players to be on our roster. At the start of each Fall 
                semester, we host tryouts to determine the roster for the year. Everyone must 
                tryout, including previous members. The team has space for roughly 35 members 
                per year, and around 100 players try out yearly. Though we are competitive, we 
                welcome players of all skill levels and experience to tryout! Even if you don't 
                make the team, tryouts can be a fun way to meet other students at Pitt who are 
                also interested in tennis.
              </p>
            </div>
            <div>
              <h5>How Tryouts Work</h5>
              <p>At the start of each Fall semester, we will send out a form that can be found 
                here or on our <a 
                  href='https://www.instagram.com/clubtennisatpitt/' 
                  target='_blank' 
                  rel='noopener noreferrer'
                  className='inline'>
                  Instagram
                </a> page. Tryouts will occur over several days at <a 
                  href="https://alphatennis.net/" 
                  target='_blank' 
                  rel='noopener noreferrer'
                  className='inline'>
                  Alpha Tennis and Fitness
                </a>, so we use this form to aggregate a list of players interested 
                in trying out as well as assign players to a day they're able to attend. After 
                this round of tryouts, we may want to host a second round of tryouts for a second 
                look at some of the players to make final decisions about the roster for the year. 
                At the end of this process, we will send out emails to all players to inform them 
                whether or not they made the team.
              </p>
            </div>
            { tryoutsInfo ? (
              <TryoutButton 
                state={tryoutsInfo.state} 
                link={tryoutsInfo.link}
              />
            ) : (
              <AnimatedButton
                href='#'
                disabled
                text='Loading tryouts info...'
              />
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

const TryoutButton = ({ state, link } : TryoutsType) => {
  let text = ''
  switch(state) {
    case 'soon':
      text = 'Tryouts Coming Soon'
      break
    case 'open':
      text = 'Sign Up For Tryouts'
      break
    case 'closed':
      text = 'Tryouts Are Closed'
  }

  return (
    <AnimatedButton 
      href={link} 
      newTab
      text={text} 
      disabled={state != 'open'}
    />
  )
}
