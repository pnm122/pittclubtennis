import { useState } from 'react'
import styles from '../Admin.module.css'
import Loader from 'components/Loader/Loader'

export default function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
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
      </form>
    </div>
  )
}
