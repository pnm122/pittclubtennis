import TournamentType from "types/TournamentType";

const filterUpcoming = (tournaments : TournamentType[] | null) => {
  if(!tournaments) return { upcoming: null, past: null }

  let upcoming : TournamentType[] | null = tournaments.filter(t => {
    return t.dateEnd.toMillis() > Date.now()
  })
  if(upcoming.length == 0) upcoming = null

  let past : TournamentType[] | null = tournaments.filter(t => {
    return t.dateEnd.toMillis() <= Date.now()
  })
  if(past.length == 0) past = null

  return { upcoming, past }
}

export default filterUpcoming