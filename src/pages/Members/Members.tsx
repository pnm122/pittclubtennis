import getMembers from 'utils/firebase/members/getMembers'
import styles from './Members.module.css'
import { useContext, useEffect, useState } from 'react'
import Skeleton from 'components/Skeleton/Skeleton'
import { MemberType } from 'types/MemberType'
import { notificationContext } from 'context/NotificationContext'

export default function Members() {
  const [members, setMembers] = useState<MemberType[] | null>(null)
  const [loading, setLoading] = useState(true)
  const { push: pushNotification } = useContext(notificationContext)

  useEffect(() => {
    getMembers().then(res => {
      if (res.error || !res.data) {
        pushNotification({
          type: 'error',
          text: 'There was an error retrieving the members.'
        })
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
              {loading ? (
                <MembersSkeleton />
              ) : members ? (
                members.length > 0 ? (
                  membersRender
                ) : (
                  <p className={styles['no-members']}>Members coming soon!</p>
                )
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export const Member = ({ name, role, year, imgSrc }: MemberType) => {
  return (
    <div className={styles['member']}>
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={name}
        />
      ) : (
        <img
          src={'images/no-image-silhouette.png'}
          alt={'Tennis Player Silhouette'}
        />
      )}
      <h3>{name}</h3>
      {role && role !== 'None' && (
        <h6>{role}</h6>
      )}
      <span>{year}</span>
    </div>
  )
}

const MembersSkeleton = () => {
  let skeletons: React.ReactNode[] = []
  const NUM_MEMBERS_EXPECTED = 35

  for (let i = 0; i < NUM_MEMBERS_EXPECTED; i++) {
    skeletons.push(
      <Skeleton
        key={i}
        aspectRatio='3/4'
      />
    )
  }

  return <>{skeletons}</>
}
