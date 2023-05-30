import Footer from 'components/Footer/Footer'
import Header from 'components/Header/Header'
import React from 'react'

export default function Page({ title, children}) {
  return (
    <>
      <Header selected={title} />
      <div id="page">
        <div className="container" id="page-title">
          <h1>{title}</h1>
        </div>
        {children}
      </div>
      <Footer selected={title} />
    </>
  )
}
