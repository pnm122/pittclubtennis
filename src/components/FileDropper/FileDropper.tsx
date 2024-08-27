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
   * Callback for when the user updates the file by either uploading or deleting the uploaded file.
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
}

export interface FileDropperRef {
  getFileData: () => Promise<string | ArrayBuffer | null>
}

const FileDropper = forwardRef<FileDropperRef, Props>(function FileDropper({
  name,
  acceptedFileTypes,
  onFileError,
  maxFileSize = 64 * 1024 * 1024,
  onChange,
  label,
  error,
  required
}, ref) {
  const input = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fileHovering, setFileHovering] = useState(false)

  useImperativeHandle(ref, () => ({
    getFileData
  }))

  const getFileData = async () => {
    if(!file) return null

    const reader = new FileReader()
    let resolve: (value: string | ArrayBuffer | null) => void
    const promise = new Promise<string | ArrayBuffer | null>(res => resolve = res)
    reader.addEventListener('load', e => {
      resolve(e.target?.result ?? null)
    })

    reader.readAsDataURL(file)
    return await promise
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] ?? null
    updateFile(newFile)
  }

  const updateFile = (newFile: File | null) => {
    if(newFile && !acceptedFileTypes.includes(newFile.type)) {
      return onFileError({
        type: 'file-type',
        details: {
          file: newFile,
          acceptedFileTypes,
          uploadedFileType: newFile.type
        }
      })
    }
    
    if(newFile && newFile.size > maxFileSize) {
      return onFileError({
        type: 'size',
        details: {
          file: newFile,
          uploadedFileSize: newFile.size,
          maxFileSize
        }
      })
    }
    setFile(newFile)
    onChange(newFile)
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
    <div className={createClasses({
      'form-elem': true,
      'form-elem--error': !!error
    })}>
      {label && <label className='form-elem__label'>{label}</label>}
      <div
        onDragEnter={() => file === null && handleDragEnter()}
        onDragLeave={() => file === null && handleDragLeave()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => file === null && handleDrop(e)}
        className={createClasses({
          'form-elem__main-control': true,
          [styles['file-dropper']]: true,
          [styles['file-dropper--file-hover']]: fileHovering,
          [styles['file-dropper--has-file']]: file !== null,
          [styles['file-dropper--error']]: !!error
        })}>
        {file === null ? (
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
              <span>{file.name}</span>
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
