import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import styles from './Admin.module.css'
import Loader from "components/Loader/Loader";

export default function Admin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('render')
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, () => {
      if(auth.currentUser) {
        navigate('/admin/edit')
      } else {
        navigate('/admin/login')
      }
  
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <>
      { loading ? (
        <div id={styles['loader']}>
          <Loader 
            size={32}
          />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  )
}
