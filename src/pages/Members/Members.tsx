import styles from './Members.module.css'

export default function Members() {
  return (
    <main>
      <section>
        <div className='container two-cols'>
          <h2>Members</h2>
          <div className='content'>
            <div id={styles['members']}>
              <Member 
                name='Chris Perry' 
                role='president' 
                year='senior'
                imgSrc='images/hero.png' 
              />
              <Member 
                name='Chris Perry' 
                role='president' 
                year='senior'
                imgSrc='images/hero.png' 
              />
              <Member 
                name='Chris Perry' 
                role='president' 
                year='senior'
                imgSrc='images/hero.png' 
              />
              <Member 
                name='Chris Perry' 
                role='president' 
                year='senior'
                imgSrc='images/hero.png' 
              />
              <Member 
                name='Chris Perry' 
                role='president' 
                year='senior'
                imgSrc='images/hero.png' 
              />
              <Member 
                name='Chris Perry' 
                role='president' 
                year='senior'
                imgSrc='images/hero.png' 
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

const Member = ({ name, role, year, imgSrc } : MemberType) => {
  return (
    <div className={styles['member']}>
      <img src={imgSrc} alt={name} />
      <h3>{name}</h3>
      <h6>{role}</h6>
      <span>{year}</span>
    </div>
  )
}
