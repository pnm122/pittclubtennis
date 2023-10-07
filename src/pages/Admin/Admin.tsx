import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { User, getAuth } from 'firebase/auth'
import styles from './Admin.module.css'
import Loader from "components/Loader/Loader";

export default function Admin() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const a = getAuth()
    setUser(a.currentUser)
    
    if(a.currentUser) {
      navigate('/admin/edit')
    } else {
      navigate('/admin/login')
    }

    setLoading(false)
  }, [location.pathname])

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
