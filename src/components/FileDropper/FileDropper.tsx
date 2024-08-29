import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import styles from './FileDropper.module.css'
import createClasses from 'utils/createClasses'
import { MdClose, MdInsertDriveFile, MdUpload } from 'react-icons/md'
import Error from 'components/Error/Error'

export type FileError = {
  type: 'size'
  details: {
    file: File
    uploadedFileSize: number
    maxFileSize: number
  }
} | {
  type: 'file-type'
  details: {
    file: File
    uploadedFileType: string
    acceptedFileTypes: string[]
  }
}

interface Props {
  /**
   * Name to associate with the input.
   */
  name: string
  /**
   * List of file types accepted by this file dropper. Must be MIME types, i.e. "image/png".
   */
  acceptedFileTypes: string[]
  /**
   * Callback for when the user attempts to upload an invalid file
   */
  onFileError: (error: FileError) => void
  /**
   * Maximum allowed size of an uploaded file in bytes. Defaults to 64 MB (64 * 1024 * 1024).
   */
  maxFileSize?: number
  /**
   * Currently selected file.
   */
  value: File | null
  /**
   * Callback for when the user updates the file by either uploading or deleting the uploaded file.
   * Fires before onFileError.
   */
  onChange: (file: File | null) => void
  /**
   * Label for the file dropper.
   */
  label?: string
  /**
   * Error for the file dropper.
   */
  error?: string
  /**
   * Whether this file dropper must have a file to continue.
   */
  required?: boolean
  /**
   * Width of the file dropper.
   */
  width?: string
}

export interface FileDropperRef {
  getFileData: () => Promise<string | ArrayBuffer | null>
}

const FileDropper = forwardRef<FileDropperRef, Props>(function FileDropper({
  name,
  acceptedFileTypes,
  onFileError,
  maxFileSize = 64 * 1024 * 1024,
  value,
  onChange,
  label,
  error,
  required,
  width
}, ref) {
  const input = useRef<HTMLInputElement>(null)
  const [fileHovering, setFileHovering] = useState(false)

  useImperativeHandle(ref, () => ({
    getFileData
  }))

  const getFileData = async () => {
    if(!value) return null

    const reader = new FileReader()
    let resolve: (value: string | ArrayBuffer | null) => void
    const promise = new Promise<string | ArrayBuffer | null>(res => resolve = res)
    reader.addEventListener('load', e => {
      resolve(e.target?.result ?? null)
    })

    reader.readAsDataURL(value)
    return await promise
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] ?? null
    updateFile(newFile)
  }

  const updateFile = (newFile: File | null) => {
    onChange(newFile)

    if(newFile && !acceptedFileTypes.includes(newFile.type)) {
      onFileError({
        type: 'file-type',
        details: {
          file: newFile,
          acceptedFileTypes,
          uploadedFileType: newFile.type
        }
      })
    }
    
    if(newFile && newFile.size > maxFileSize) {
      onFileError({
        type: 'size',
        details: {
          file: newFile,
          uploadedFileSize: newFile.size,
          maxFileSize
        }
      })
    }
  }

  const handleDragEnter = () => {
    setFileHovering(true)
  }

  const handleDragLeave = () => {
    setFileHovering(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setFileHovering(false)

    updateFile(e.dataTransfer.files.item(0))
  }

  return (
    <div
    style={width ? { width } : undefined}
    className={createClasses({
      'form-elem': true,
      'form-elem--error': !!error
    })}>
      {!!label && (
        <label className={'form-elem__label'} htmlFor={name}>
          {label}
          {required && <span className={'required-star'}>*</span>}
        </label>
      )}
      <div
        onDragEnter={() => value === null && handleDragEnter()}
        onDragLeave={() => value === null && handleDragLeave()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => value === null && handleDrop(e)}
        className={createClasses({
          'form-elem__main-control': true,
          [styles['file-dropper']]: true,
          [styles['file-dropper--file-hover']]: fileHovering,
          [styles['file-dropper--has-file']]: value !== null,
          [styles['file-dropper--error']]: !!error
        })}>
        {value === null ? (
          <>
            <MdUpload className={styles['file-dropper__icon']} />
            {fileHovering ? (
              <span className={styles['file-dropper__text']}>
                Drop file to upload
              </span>
            ) : (
              <span className={styles['file-dropper__text']}>
                Drop file here or <label htmlFor={name} className={styles['file-dropper__upload-file']}>browse files</label>
              </span>
            )}
          </>
        ) : (
          <>
            <div className={styles['file-dropper__filename']}>
              <MdInsertDriveFile />
              <span>{value.name}</span>
            </div>
            <button
              className={createClasses({
                [styles['file-dropper__delete']]: true,
                'with-hover-circle': true
              })}
              onClick={() => updateFile(null)}>
              <MdClose />
            </button>
          </>
        )}
        <input
          type='file'
          name={name}
          id={name}
          ref={input}
          onChange={handleChange}
          accept={acceptedFileTypes.join(',')}
          className='hidden'
          required={required}
        />
      </div>
      {error && <Error>{error}</Error>}
    </div>
  )
})

export default FileDropper
