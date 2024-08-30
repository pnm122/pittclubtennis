import Input from "components/Input/Input";
import Select from "components/Select/Select";
import { forwardRef, useEffect, useImperativeHandle, useReducer, useRef, useState } from "react";
import { AdminMemberDrawer } from "types/AdminMembers";
import styles from './Members.module.css';
import FileDropper, { FileDropperRef, FileError } from "components/FileDropper/FileDropper";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { Member } from "pages/Members/Members";

export interface MemberDrawerContentRef {
  getState: () => MemberDrawerState
}

type Props = AdminMemberDrawer & {
  onEdited: () => void,
  open: boolean
}

export interface MemberDrawerState {
  name: string,
  year: MemberYear,
  role: string,
  image: {
    source: 'firebase',
    data: string
  } | {
    source: 'local',
    data: File | null
  }
}

const MemberDrawerContent = forwardRef<MemberDrawerContentRef, Props>(({
  data,
  type,
  onEdited,
  open
}, ref) => {
  const getStateFromProps = ({ data: { name, year, role, imgSrc } }: AdminMemberDrawer): MemberDrawerState => {
    return {
      name,
      year,
      role: role ?? 'None',
      image: imgSrc
        ? { source: 'firebase', data: imgSrc }
        : { source: 'local', data: null }
    }
  }
  
  const reducer = (inputs: MemberDrawerState, action: { type: keyof MemberDrawerState | 'reset', data?: MemberDrawerState[keyof MemberDrawerState] }) => {
    switch(action.type) {
      case 'reset':
        return getStateFromProps({ data, type })
      case 'name':
      case 'year':
      case 'role':
      case 'image':
        onEdited()
        return {
          ...inputs,
          [action.type]: action.data
        }
      default:
        return inputs
    }
  }

  const imageFileDropper = useRef<FileDropperRef>(null)
  const [inputs, dispatch] = useReducer(reducer, getStateFromProps({ data, type }))
  // URL to use as image source
  const [image, setImage] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  useImperativeHandle(ref, () => ({
    getState: () => inputs
  }))

  useEffect(() => {
    if(open) {
      dispatch({ type: 'reset' })
    }
  }, [open])

  useEffect(() => {
    if(inputs.image.source === 'local' && inputs.image.data) {
      setImage(URL.createObjectURL(inputs.image.data))
    } else if(inputs.image.source === 'firebase') {
      setImage(inputs.image.data)
    } else {
      setImage(null)
    }
  }, [inputs.image])

  function handleFileUploadError(error: FileError) {
    if(error.type === 'size') {
      setImageError('Image must be less than 2 MB')
    } else {
      setImageError('File must be an image')
    }
  }

  return (
    <div className={styles['member-drawer']}>
      <Input
        name='name'
        value={inputs.name}
        label='Name'
        required
        onChange={e => dispatch({ type: 'name', data: e.target.value })}
      />
      <Select
        label='Year'
        options={[{
          value: 'Freshman',
          name: 'freshman'
        }, {
          value: 'Sophomore',
          name: 'sophomore'
        }, {
          value: 'Junior',
          name: 'junior'
        }, {
          value: 'Senior',
          name: 'senior'
        }, {
          value: 'Graduate Student',
          name: 'graduate student'
        }]}
        value={inputs.year}
        onChange={({ selected }) => dispatch({ type: 'year', data: selected })}
        required
      />
      <Select
        label='Role'
        options={[
          'None',
          'President',
          'Vice President',
          'Business Manager',
          'Logistics Manager',
          'Social Chair',
          'Fundraising Chair',
          'Fundraising Committee'
        ]}
        value={inputs.role}
        onChange={({ selected }) => dispatch({ type: 'role', data: selected })}
        required
      />
      <FileDropper
        label='Image (max. size 2MB)'
        name='image-drop'
        acceptedFileTypes={['image/png', 'image/jpeg']}
        maxFileSize={2 * 1024 * 1024}
        onFileError={handleFileUploadError}
        error={imageError ?? undefined}
        value={inputs.image?.source === 'firebase' ? new File([], 'Uploaded image') : inputs.image?.source === 'local' ? inputs.image.data : null}
        onChange={file => {
          dispatch({ type: 'image', data: { source: 'local', data: file } })
          setImageError(null)
        }}
        ref={imageFileDropper}
      />
      <div className={styles['preview']}>
        <h3 className={styles['preview__title']}>Preview</h3>
        <Member
          name={inputs.name}
          role={inputs.role === 'None' ? undefined : inputs.role}
          year={inputs.year}
          imgSrc={image ?? undefined}
        />
      </div>
    </div>
  )
}
)

export default MemberDrawerContent