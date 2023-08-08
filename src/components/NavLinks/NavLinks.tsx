import { NavLink } from "react-router-dom"

export default function NavLinks() {
  const links = [
    { path: '/about', name: 'About' },
    { path: '/tryouts', name: 'Tryouts' },
    { path: '/fundraisers', name: 'Fundraisers' },
    { path: '/tournaments', name: 'Tournaments' },
    { path: '/members', name: 'Members' }
  ]

  return (
    <nav>
      <ul>
        { links.map(link => {
          return (
            <li key={link.path}>
              <NavLink to={link.path}>{link.name}</NavLink>
            </li>
          )
        }) }
      </ul>
    </nav>
  )
}
