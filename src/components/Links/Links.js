import React from 'react'
import { Link } from 'react-router-dom'

export default function Links() {
  return (
    <>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/tryouts">Tryouts</Link></li>
      <li><Link to="/fundraisers">Fundraisers</Link></li>
      <li><Link to="/tournaments">Tournaments</Link></li>
      <li><Link to="/members">Members</Link></li>
    </>
  )
}
