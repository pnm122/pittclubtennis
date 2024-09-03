import FundraiserType from 'types/FundraiserType'
import styles from './Fundraisers.module.css'
import { RxExternalLink } from 'react-icons/rx'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import { useContext, useEffect, useState } from 'react'
import getFundraisers from 'utils/firebase/getFundraisers'
import Skeleton from 'components/Skeleton/Skeleton'
import { notificationContext } from 'context/NotificationContext'

export default function Fundraisers() {
  const [fundraisers, setFundraisers] = useState<FundraiserType[] | null>(null)
  const [loading, setLoading] = useState(true)
  const { push: pushNotification } = useContext(notificationContext)

  useEffect(() => {
    getFundraisers().then(res => {
      if (res.error || !res.data) {
        pushNotification({
          type: 'error',
          text: 'There was an error retrieving the fundraisers.'
        })
        setLoading(false)
        return
      }

      setFundraisers(res.data.map(f => f.data))
      setLoading(false)
    })
  }, [])

  return (
    <main>
      <section>
        <div className='container two-cols'>
          <h2 className='title'>Fundraisers</h2>
          <div className='content fade-in'>
            <p>
              We need your support! Fundraisers help us afford practices, attend
              tournaments, among other club expenses. Check out our fundraisers
              below to see how you can help us today!
            </p>
            {loading ? (
              <>
                <FundraiserSkeleton />
                <FundraiserSkeleton />
              </>
            ) : fundraisers ? (
              fundraisers.map((f, index) => {
                return (
                  <Fundraiser
                    key={index}
                    name={f.name}
                    description={f.description}
                    linkLocation={f.linkLocation}
                    linkTitle={f.linkTitle}
                  />
                )
              })
            ) : (
              <p className='error'>Error loading fundraisers.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

const Fundraiser = ({
  name,
  description,
  linkLocation,
  linkTitle
}: FundraiserType) => {
  return (
    <div className={styles['fundraiser']}>
      <h3>{name}</h3>
      <p>{description}</p>
      <AnimatedButton
        href={linkLocation}
        text={linkTitle}
        afterText={<RxExternalLink />}
        newTab
      />
    </div>
  )
}

const FundraiserSkeleton = () => {
  return (
    <div className={styles['fundraiser-skeleton']}>
      <Skeleton
        width='200px'
        height='var(--text-xl)'
      />
      <Skeleton
        width='100%'
        height='var(--text-md)'
      />
      <Skeleton
        width='90%'
        height='var(--text-md)'
      />
      <Skeleton
        width='30%'
        height='var(--text-md)'
      />
      <Skeleton
        width='125px'
        height='var(--size-3xl)'
      />
    </div>
  )
}
