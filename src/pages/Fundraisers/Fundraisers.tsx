import FundraiserType from 'types/FundraiserType'
import styles from './Fundraisers.module.css'
import { RxExternalLink } from 'react-icons/rx'
import AnimatedLink from 'components/AnimatedLink/AnimatedLink'
import { useEffect, useState } from 'react'
import getFundraisers from 'utils/firebase/getFundraisers'
import Skeleton from 'components/Skeleton/Skeleton'

export default function Fundraisers() {
  const [fundraisers, setFundraisers] = useState<FundraiserType[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFundraisers().then(res => {
      if(res.error || !res.data) {
        console.error(res.error)
        setLoading(false)
        return
      }

      setFundraisers(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <main>
      <section>
        <div className="container two-cols">
          <h2 className='title'>Fundraisers</h2>
          <div className='content'>
            { loading ? (
              <>
                <FundraiserSkeleton />
                <FundraiserSkeleton />
              </>
            ) : (
              fundraisers ? (
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
              )
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

const Fundraiser = ({ name, description, linkLocation, linkTitle } : FundraiserType) => {
  return (
    <div className={styles['fundraiser']}>
      <h3>{name}</h3>
      <p>{description}</p>
      <AnimatedLink 
        to={linkLocation} 
        text={linkTitle}
        newTab
        className='primary-button'>
        <RxExternalLink />
      </AnimatedLink>
    </div>
  )
}

const FundraiserSkeleton = () => {
  return (
    <div className={styles['fundraiser-skeleton']}>
      <Skeleton width='200px' height='var(--text-xl)' />
      <Skeleton width='100%' height='var(--text-md)' />
      <Skeleton width='90%' height='var(--text-md)' />
      <Skeleton width='30%' height='var(--text-md)' />
      <Skeleton width='125px' height='var(--size-3xl)' />
    </div>
  )
}
