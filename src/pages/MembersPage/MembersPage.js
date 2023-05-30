import React from 'react'
import styles from './MembersPage.module.css'
import Header from 'components/Header/Header'
import Footer from 'components/Footer/Footer'
import Member from 'components/Member/Member'
import members from 'data/members.json';

export default function MemberPage() {
  let membersRender = members.map(m => {
    return <Member key={m.id} name={m.name} position={m.position} picture={m.picture} bio={m.bio} />
  })
  return (
    <>
      <Header />
      <div id="page">
        <div className='container' id='page-title'>
          <h1>Members</h1>
        </div>
        <div className='container section'>
          <div id={styles.members}>
            {membersRender}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
