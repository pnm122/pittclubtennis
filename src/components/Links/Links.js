import React from 'react'
import { Link } from 'react-router-dom'

export default function Links({ selected }) {

  // If no selected tab was passed in, set it to an empty string to avoid null errors
  if(!selected) selected = '';

  return (
    <>
      <li><Link role='tab' aria-selected={ selected === 'About' } to="/about">About</Link></li>
      <li><Link role='tab' aria-selected={ selected === 'Tryouts' } to="/tryouts">Tryouts</Link></li>
      <li><Link role='tab' aria-selected={ selected === 'Fundraisers' } to="/fundraisers">Fundraisers</Link></li>
      <li><Link role='tab' aria-selected={ selected === 'Tournaments' } to="/tournaments">Tournaments</Link></li>
      <li><Link role='tab' aria-selected={ selected === 'Members' } to="/members">Members</Link></li>
    </>
  )
}
