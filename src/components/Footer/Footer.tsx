import NavLinks from "components/NavLinks/NavLinks";
import 'footer.css'
import { AiFillInstagram } from 'react-icons/ai'
// import { FaTiktok } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="container">
      <div id='inner'>
        <div id='upper'>
          <img id='logo' src='images/logo.png' alt='Club Tennis Logo' />
          <div id='lists'>
            <div className='list'>
              <h6>Links</h6>
              <NavLinks />
            </div>
            <div className='list'>
              <h6>Contact</h6>
              <ul>
                <li><a href='mailto:pittctt@gmail.com'>pittctt@gmail.com</a></li>
              </ul>
            </div>
          </div>
        </div>
        <hr />
        <div id='lower' className='split'>
          <div id='copyright'>
            <span>Copyright ©{new Date(Date.now()).getFullYear()}</span>
            <span>
              Designed by <a 
                href='https://pierce-martin.com' 
                target='_blank' 
                rel='noopener noreferrer'>
                Pierce Martin
              </a>
            </span>
          </div>
          <div id='socials'>
            <a 
              href='https://www.instagram.com/clubtennisatpitt/' 
              target='_blank' 
              rel='noopener noreferrer'>
              <AiFillInstagram />
            </a>
            {/* <a 
              href='#'
              target='_blank' 
              rel='noopener noreferrer'>
              <FaTiktok />
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  )
}
