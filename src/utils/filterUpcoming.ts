import TournamentType from 'types/TournamentType'

const filterUpcoming = (tournaments: TournamentType[] | null) => {
  if (!tournaments) return { upcoming: null, past: null }

  let upcoming: TournamentType[] | null = tournaments.filter(t => {
    return t.dateEnd.toMillis() > Date.now()
  })
  // Sort upcoming by soonest first
  upcoming.sort((t1, t2) => {
    return t1.dateStart.seconds - t2.dateStart.seconds
  })

  if (upcoming.length == 0) upcoming = null

  let past: TournamentType[] | null = tournaments.filter(t => {
    return t.dateEnd.toMillis() <= Date.now()
  })
  // Sort past by most recent first
  past.sort((t1, t2) => {
    return t2.dateStart.seconds - t1.dateStart.seconds
  })

  if (past.length == 0) past = null

  return { upcoming, past }
}

export default filterUpcoming
