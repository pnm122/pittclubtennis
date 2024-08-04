import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import { DatepickerContext } from "./Datepicker"
import styles from './Datepicker.module.css'
import { addDays, addMonths, addWeeks, eachDayOfInterval, eachWeekOfInterval, endOfMonth, endOfWeek, isSameDay, isSameMonth, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from "date-fns"
import createClasses from "utils/createClasses"
import CalendarDay from "./CalendarDay"
import waitFor from "utils/waitFor"

interface Props {
  month: Date
  setMonth: React.Dispatch<React.SetStateAction<Date>>
}

export interface CalendarRef {
  focus: () => Promise<boolean>
}

const Calendar = forwardRef<CalendarRef, Props>(function Calendar({
  month,
  setMonth
}: Props, ref) {
  useImperativeHandle(ref, () => {
    return {
      focus
    }
  })

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
  const { value, disabledDates, open, onChange } = useContext(DatepickerContext)
  const [focusedDate, setFocusedDate] = useState<Date | null>(null)
  const calendar = useRef<HTMLTableElement>(null)

  const initFocusedDate = () => {
    setFocusedDate(
      value && isSameMonth(month, value)
        ? value
        : startOfMonth(month)
    )
  }

  const focus = async () => {
    if(calendar.current) {
      if(!focusedDate) {
        initFocusedDate()
      }
      await waitFor(() => {
        const visibility = calendar.current?.computedStyleMap().get('visibility')?.toString()
        return visibility === 'visible'
      })
      calendar.current?.focus()
      return true
    } else {
      return false
    }
  }

  const isDisabled = (date: Date) => {
    if(typeof disabledDates === 'function') {
      return disabledDates(date)
    } else {
      return !!disabledDates.find(d => isSameDay(d, date))
    }
  }

  useEffect(() => {
    if(!open) {
      setFocusedDate(null)
    }
  }, [open])

  const updateFocusedDate = (newFocusedDate: Date) => {
    setFocusedDate(newFocusedDate)
    if(focusedDate && !isSameMonth(newFocusedDate, focusedDate)) {
      setMonth(startOfMonth(newFocusedDate))
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if(!focusedDate) return
    if(e.key === 'ArrowRight') {
      updateFocusedDate(addDays(focusedDate, 1))
    } else if(e.key === 'ArrowLeft') {
      updateFocusedDate(subDays(focusedDate, 1))
    } else if(e.key === 'ArrowUp') {
      updateFocusedDate(subWeeks(focusedDate, 1))
    } else if(e.key === 'ArrowDown') {
      updateFocusedDate(addWeeks(focusedDate, 1))
    } else if(e.key === 'Home' && !e.ctrlKey) {
      updateFocusedDate(startOfWeek(focusedDate))
    } else if(e.key === 'Home' && e.ctrlKey) {
      updateFocusedDate(startOfMonth(focusedDate))
    } else if(e.key === 'End' && !e.ctrlKey) {
      updateFocusedDate(endOfWeek(focusedDate))
    } else if(e.key === 'End' && e.ctrlKey) {
      updateFocusedDate(endOfMonth(focusedDate))
    } else if(e.key === 'PageUp') {
      updateFocusedDate(subMonths(focusedDate, 1))
    } else if(e.key === 'PageDown') {
      updateFocusedDate(addMonths(focusedDate, 1))
    } else if(e.key === 'Enter' && !isDisabled(focusedDate)) {
      onChange(focusedDate)
    }
  }

  const onFocus = () => {
    if(!focusedDate) {
      initFocusedDate()
    }
  }

  return (
    <table
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={styles['calendar']}
      role="grid"
      aria-activedescendant=""
      onFocus={onFocus}
      ref={calendar}>
      <thead>
        <tr className={styles['calendar__weekdays']}>
          {
            weekdays.map(d => (
              <th
                className={styles['weekday']}
                key={d}
                scope="col"
                abbr={d}>
                {d.slice(0, 3)}
              </th>
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
            <tr className={styles['calendar__week']} key={week.toString()}>
              {
                eachDayOfInterval({
                  start: startOfWeek(week),
                  end: endOfWeek(week)
                }).map(date => (
                  <CalendarDay
                    key={date.toString()}
                    date={date}
                    month={month}
                    selected={!!value && isSameDay(value, date)}
                    focused={!!focusedDate && isSameDay(focusedDate, date)}
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
})

export default Calendar
