import { useState } from 'react'
import styles from '../Admin.module.css'
import Loader from 'components/Loader/Loader'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    
    const auth = getAuth()

    signInWithEmailAndPassword(auth, email, pass)
    .then(credential => {
      navigate('/admin/edit')
    })
    .catch(e => {
      setLoading(false)
      setError(e.code)
      
      switch(e.code) {
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Incorrect login details.')
          break
        default:
          setError('An unknown error occurred.')
          break
      }

      setLoading(false)
    })
  }

  return (
    <div id={styles['login']}>
      <img src='/images/logo_blue_gold.png' alt='Club Tennis Logo' />
      <form id={styles['login-form']} onSubmit={handleSubmit}>
        <div className={styles['form-section']}>
          <label htmlFor='email'>Email</label>
          <input 
            value={email} 
            name='email'
            type='email'
            placeholder='Email' 
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className={styles['form-section']}>
          <label htmlFor='email'>Password</label>
          <input 
            value={pass} 
            name='password'
            type='password'
            placeholder='Password' 
            onChange={e => setPass(e.target.value)}
          />
        </div>
        <button disabled={loading} type='submit'>
          { loading ? (
            <Loader 
              size={16}
              innerColor='var(--primary)'
              bgColor='rgba(255, 255, 255, 0.25)' 
              color='white' 
            />
          ) : (
            "Login"
          )}
        </button>
        <span id={styles['error']}>{error}</span>
      </form>
    </div>
  )
}
