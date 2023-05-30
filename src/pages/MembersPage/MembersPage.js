import React from 'react'
import styles from './MembersPage.module.css'
import Member from 'components/Member/Member'
import members from 'data/members.json';
import Page from 'components/Page/Page'
import useScroll from 'hooks/useScroll';

export default function MemberPage() {
  useScroll();
  const title = "Members";

  let membersRender = members.map(m => {
    return <Member key={m.id} name={m.name} position={m.position} picture={m.picture} bio={m.bio} />
  })
  return (
    <Page title={title}>
      <div className='container section'>
        <div id={styles.members}>
          {membersRender}
        </div>
      </div>
    </Page>
  )
}
