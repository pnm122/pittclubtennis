import { ClassList } from "types/ClassList";

export default function createClasses(list: ClassList) {
  return Object.keys(list)
  .filter(key => {
    return list[key]
  })
  .join(' ')
}