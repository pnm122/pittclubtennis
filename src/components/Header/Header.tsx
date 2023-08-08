import { Link } from 'react-router-dom'
import NavLinks from 'components/NavLinks/NavLinks'
import { useState } from 'react'
import 'header.css'

export default function Header() {
  const [active, setActive] = useState(false)

  return (
    <header 
      className='container'
      aria-expanded={active}>
      <div id='header-inner'>
        <Link to='/' id='title'>Page Title</Link>
        <NavLinks />
        <button 
          onClick={() => setActive(!active)} 
          aria-label='Toggle navigation'
          id='toggle-nav'>
          <div className='line'></div>
          <div className='line'></div>
          <div className='line'></div>
        </button>
      </div>
      <div id='header-close' onClick={() => setActive(false)}></div>
    </header>
  )
}
