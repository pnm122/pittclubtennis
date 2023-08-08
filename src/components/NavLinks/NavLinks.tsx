import { NavLink } from "react-router-dom"

export default function NavLinks() {
  const links = [
    { path: '/', name: 'Item 1' },
    { path: '/a', name: 'Item 2' },
    { path: '/b', name: 'Item 3' },
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
