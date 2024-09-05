import createClasses from 'utils/createClasses'
import styles from './HorizontalLoader.module.css'

interface Props {
  className?: string
}

export default function HorizontalLoader({ className }: Props) {
  return (
    <div
      className={createClasses({
        [styles['loader']]: true,
        ...(className ? { [className]: true } : {})
      })}></div>
  )
}
