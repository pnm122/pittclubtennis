import { useContext } from "react"
import { DatepickerContext } from "./Datepicker"
import styles from './Datepicker.module.css'
import { eachDayOfInterval, eachWeekOfInterval, endOfMonth, endOfWeek, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns"
import createClasses from "utils/createClasses"
import CalendarDay from "./CalendarDay"

interface Props {
  month: Date
}

export default function Calendar({
  month
}: Props) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
  const { value, disabledDates } = useContext(DatepickerContext)

  const isDisabled = (date: Date) => {
    if(typeof disabledDates === 'function') {
      return disabledDates(date)
    } else {
      return !!disabledDates.find(d => isSameDay(d, date))
    }
  }

  return (
    <table className={styles['calendar']}>
      <thead>
        <tr className={styles['calendar__weekdays']}>
          {
            weekdays.map(d => (
              <th className={styles['weekday']}>{d.slice(0, 3)}</th>
            ))
          }
        </tr>
      </thead>
      <tbody className={styles['calendar__body']}>
        {
          eachWeekOfInterval({
            start: startOfMonth(month),
            end: endOfMonth(month)}
          ).map(week => (
            <tr className={styles['calendar__week']}>
              {
                eachDayOfInterval({
                  start: startOfWeek(week),
                  end: endOfWeek(week)
                }).map(date => (
                  <CalendarDay
                    date={date}
                    month={month}
                    selected={!!value && isSameDay(value, date)}
                    disabled={isDisabled(date)}
                  />
                ))
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}
