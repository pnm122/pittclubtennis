import { NavLink } from "react-router-dom"

interface Props {
  links: { path: string, name: string }[]
}

export default function NavLinks({ links }: Props) {
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
