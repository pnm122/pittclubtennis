import Input from "components/Input/Input";
import { useEffect, useReducer } from "react";
import { AdminMemberDrawer } from "types/AdminMembers";

export default function MemberDrawer({
  data,
  type
}: AdminMemberDrawer) {
  interface DrawerState {
    name?: string,
    year?: MemberYear,
    role?: string,
    image?: {
      source: 'firebase' | 'local',
      data: any
    }
  }

  const getStateFromProps = ({ data }: AdminMemberDrawer): DrawerState => {
    return {
      name: data.name,
      year: data.year,
      role: data.role,
      image: data.imgSrc
        ? { source: 'firebase', data: data.imgSrc }
        : undefined
    }
  }
  
  const reducer = (inputs: DrawerState, action: { type: string, data?: string }) => {
    switch(action.type) {
      case 'reset':
        return getStateFromProps({ data, type })
      case 'name':
        return {
          ...inputs,
          name: action.data
        }
      default:
        return inputs
    }
  }

  const [inputs, dispatch] = useReducer(reducer, getStateFromProps({ data, type }))

  useEffect(() => {
    dispatch({ type: 'reset' })
  }, [data])

  return (
    <>
      <Input
        name='name'
        value={inputs.name}
        label='Name'
        required
        onChange={e => dispatch({ type: 'name', data: e.target.value })}
      />
    </>
  )
}
