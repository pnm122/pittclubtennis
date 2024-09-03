import { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import styles from './Admin.module.css'
import Loader from 'components/Loader/Loader'
import Header from 'components/Header/Header'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import './admin.css'
import { notificationContext } from 'context/NotificationContext'

export default function Admin() {
  const adminLinks = [
    {
      path: '/admin/tournaments',
      name: 'Tournaments'
    },
    {
      path: '/admin/members',
      name: 'Members'
    },
    {
      path: '/admin/fundraisers',
      name: 'Fundraisers'
    },
    {
      path: '/admin/tryouts',
      name: 'Tryouts'
    }
  ]

  const auth = getAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const { push: pushNotification } = useContext(notificationContext)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      if (auth.currentUser && location.pathname === '/admin/login') {
        navigate('/admin/members')
      } else if (!auth.currentUser) {
        navigate('/admin/login')
      }

      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const logOut = async () => {
    try {
      await auth.signOut()
    } catch (e) {
      pushNotification({
        type: 'error',
        text: 'There was an error signing out.',
        subtext: (e as any).toString(),
        timeout: -1,
        dismissable: true
      })
    }
  }

  const adminHeaderTitle = <span id='header-title'>Dashboard</span>

  const adminRightSlot = (
    <AnimatedButton
      style='accent'
      size='small'
      onClick={logOut}
      text='Log out'
    />
  )

  return (
    <>
      {loading ? (
        <div id={styles['loader']}>
          <Loader size={32} />
        </div>
      ) : (
        <>
          {auth.currentUser && (
            <Header
              leftSlot={adminHeaderTitle}
              links={adminLinks}
              rightSlot={adminRightSlot}
            />
          )}
          <Outlet />
        </>
      )}
    </>
  )
}
