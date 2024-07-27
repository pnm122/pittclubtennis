export type RoleColors = { bg: string, text: string }

export const roleColors: { [role: string]: RoleColors } = {
  'President': {
    bg: '#140D92',
    text: '#E4E2FF'
  },
  'Vice President': {
    bg: '#006275',
    text: '#E0FAFF'
  },
  'Business Manager': {
    bg: '#428000',
    text: '#F3FFE6'
  },
  'Logistics Manager': {
    bg: '#C08D00',
    text: '#FFFDDE'
  },
  'Social Chair': {
    bg: '#BC4B00',
    text: '#FFEADC'
  },
  'Fundraising Chair': {
    bg: '#B40024',
    text: '#FFE0E6'
  },
  'Fundraising Committee': {
    bg: '#9000A6',
    text: '#FBE0FF'
  },
  'default': {
    bg: '#4f5560',
    text: '#f0f1f3'
  }
} as const

export const getRoleColors = (role: string | undefined) => {
  if(!role) return roleColors['default']
  const colors = roleColors[role]
  if(!colors) return roleColors['default']
  return colors
}