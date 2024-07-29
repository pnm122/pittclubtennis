import { useState } from 'react'
import styles from '../Admin.module.css'
import Loader from 'components/Loader/Loader'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import AnimatedButton from 'components/AnimatedButton/AnimatedButton'
import Input from 'components/Input/Input'

export default function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    
    const auth = getAuth()

    signInWithEmailAndPassword(auth, email, pass)
    .then(_ => {
      // handled by onAuthStateChanged
    })
    .catch(e => {
      setLoading(false)
      
      switch(e.code) {
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Incorrect login details.')
          break
        default:
          setError('An unknown error occurred.')
          break
      }
    })
  }

  return (
    <main id={styles['login']}>
      <img src='/images/logo_blue_gold.png' alt='Club Tennis Logo' />
      <form id={styles['login-form']} onSubmit={handleSubmit}>
        <Input
          label='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          name='email'
          type='email'
          placeholder='johndoe@example.com'
          error={error}
          required
        />
        <Input
          label='Password'
          value={pass}
          onChange={e => setPass(e.target.value)}
          name='password'
          type='password'
          error={error}
          required
        />
        <AnimatedButton
          type='button'
          text='Login'
          submit
          fullWidth
          loading={loading}
        />
      </form>
    </main>
  )
}
