import React from 'react'

export default function NewTabLink({ href, id, className, children, title }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" id={id} className={className} title={title}>{children}</a>
  )
}
