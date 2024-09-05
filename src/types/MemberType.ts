import { MemberDrawerState } from 'pages/Admin/Members/MemberDrawerContent'

export type MemberYear =
  | 'freshman'
  | 'sophomore'
  | 'junior'
  | 'senior'
  | 'graduate student'

export interface MemberType {
  name: string
  role: string
  year: MemberYear
  imgSrc?: string
}

export type SetMemberType = MemberDrawerState
