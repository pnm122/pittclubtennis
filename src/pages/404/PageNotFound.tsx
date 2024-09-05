import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import styles from './PageNotFound.module.css'
import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'

export default function PageNotFound() {
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const rTo = gsap.quickTo('#tennis-ball', 'rotation', {
        duration: 0.33
      })

      window.addEventListener('mousemove', e => {
        const ball = document.getElementById('tennis-ball')
        if (!ball) return

        rTo((-1 * (ball.clientLeft - e.clientX)) / 3)
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <main>
      <div className='container'>
        <div id={styles['pagenotfound']}>
          <h1 id={styles['title']}>
            4
            <img
              src='images/404-tennisball.png'
              id='tennis-ball'
              alt='Tennis ball'></img>
            4
          </h1>
          <h4>Page Not Found</h4>
          <AnimatedButton
            href='/'
            text='Go back home'
          />
        </div>
      </div>
    </main>
  )
}
