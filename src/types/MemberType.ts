type MemberYear = 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate student'

interface MemberType {
  name: string
  role?: string
  year: MemberYear
  imgSrc?: string
}