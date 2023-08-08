import styles from './Header.module.css'
import { Link } from 'react-router-dom'
import NavLinks from 'components/NavLinks/NavLinks'

export default function Header() {
  return (
    <header>
      <div className='container split'>
        <Link to='/'><h6>Page Title</h6></Link>
        <NavLinks />
      </div>
    </header>
  )
}
