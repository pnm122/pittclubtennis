import NavLinks from "components/NavLinks/NavLinks";
import 'footer.css'
import { AiFillInstagram } from 'react-icons/ai'
import { defaultLinks } from "utils/defaultLinks";

export default function Footer() {
  return (
    <footer className="container">
      <div id='inner'>
        <div id='upper'>
          <img id='logo' src='images/logo.png' alt='Club Tennis Logo' />
          <div id='lists'>
            <div className='list'>
              <span>Links</span>
              <NavLinks links={defaultLinks} />
            </div>
            <div className='list'>
              <span>Contact</span>
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
              rel='noopener noreferrer'
              aria-label='Instagram'>
              <AiFillInstagram />
            </a>
            {/* <a 
              href='#'
              target='_blank' 
              rel='noopener noreferrer'
              aria-label='TikTok'>
              <FaTiktok />
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  )
}
