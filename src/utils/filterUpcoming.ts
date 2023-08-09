import TournamentType from "types/TournamentType";

const filterUpcoming = (tournaments : TournamentType[]) => {
  const upcoming = tournaments.filter(t => {
    return t.dateEnd.toMillis() > Date.now()
  })
  const past = tournaments.filter(t => {
    return t.dateEnd.toMillis() <= Date.now()
  })

  return { upcoming, past }
}

export default filterUpcoming