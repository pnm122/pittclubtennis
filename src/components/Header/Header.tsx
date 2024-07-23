import NavLinks from 'components/NavLinks/NavLinks'
import { useState, useEffect } from 'react'
import 'header.css'

interface Props {
  links: { path: string, name: string }[]
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
}

export default function Header({ links, leftSlot, rightSlot }: Props) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(false)
  }, [location.pathname])

  return (
    <header 
      className='container'
      aria-expanded={active}>
      <div id='header-inner'>
        {leftSlot}
        <div id='header-right'>
          <NavLinks links={links} />
          {rightSlot}
          <button 
            onClick={() => setActive(!active)} 
            aria-label='Toggle navigation'
            id='toggle-nav'>
            <div className='hamburger-line'></div>
            <div className='hamburger-line'></div>
            <div className='hamburger-line'></div>
          </button>
        </div>
      </div>
      <div id='header-close' onClick={() => setActive(false)}></div>
    </header>
  )
}
