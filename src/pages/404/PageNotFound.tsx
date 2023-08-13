import AnimatedLink from 'components/AnimatedLink/AnimatedLink'
import styles from './PageNotFound.module.css'
import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'

export default function PageNotFound() {
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const rTo = gsap.quickTo('#tennis-ball', 'rotation', {
        duration: 0.33,
      })

      window.addEventListener('mousemove', e => {
        const ball = document.getElementById('tennis-ball')
        if(!ball) return

        rTo(-1 * (ball.clientLeft - e.clientX) / 3)
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <main>
      <div className='container'>
        <div id={styles['pagenotfound']}>
          <h1 id={styles['title']}>4<img src='images/404-tennisball.png' id='tennis-ball'></img>4</h1>
          <h4>Page Not Found</h4>
          <AnimatedLink to='/' text='Go back home' className='primary-button' />
        </div>
      </div>
    </main>
  )
}
