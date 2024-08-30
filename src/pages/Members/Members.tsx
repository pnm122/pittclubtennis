import getMembers from 'utils/firebase/getMembers'
import styles from './Members.module.css'
import { useEffect, useState } from 'react'
import Skeleton from 'components/Skeleton/Skeleton'

export default function Members() {
  const [members, setMembers] = useState<MemberType[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMembers().then(res => {
      if(res.error || !res.data) {
        // TODO: show error
        return
      }

      setMembers(res.data.map(d => d.data))
      setLoading(false)
    })
  }, [])

  const membersRender = members?.map((member, index) => {
    return (
      <Member
        key={index}
        name={member.name}
        role={member.role}
        year={member.year}
        imgSrc={member.imgSrc}
      />
    )
  })

  return (
    <main>
      <section>
        <div className='container two-cols'>
          <h2 className='title'>Members</h2>
          <div className='content fade-in'>
            <div id={styles['members']}>
              { loading ? (
                <MembersSkeleton />
              ) : (
                members ? (
                  members.length > 0 ? (
                    membersRender
                  ) : (
                    <p>Members coming soon!</p>
                  )
                ) : (
                  <p className='error'>Error loading members.</p>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export const Member = ({ name, role, year, imgSrc } : MemberType) => {
  return (
    <div className={styles['member']}>
      { imgSrc ? <img src={imgSrc} alt={name} /> : <img src={'images/no-image-silhouette.png'} alt={'Tennis Player Silhouette'} /> }
      <h3>{name}</h3>
      <h6>{role}</h6>
      <span>{year}</span>
    </div>
  )
}

const MembersSkeleton = () => {
  let skeletons : React.ReactNode[] = []
  const NUM_MEMBERS_EXPECTED = 35

  for(let i = 0; i < NUM_MEMBERS_EXPECTED; i++) {
    skeletons.push(<Skeleton key={i} aspectRatio='3/4' />)
  }

  return (
    <>
      {skeletons}
    </>
  )
}
