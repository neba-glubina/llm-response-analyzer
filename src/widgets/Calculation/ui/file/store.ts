import { createSlice } from '@/store/utils'
import slugify from 'slugify'

type BaseFile = Pick<File, 'name' | 'size' | 'lastModified'>

type SingleFile = { readonly id: string } & BaseFile

export type FileStore = {
  fileSlice: {
    strategy: 'append' | 'replace' | 'merge'
    updateStrategy: (strategy: FileStore['fileSlice']['strategy']) => void
    files: Record<SingleFile['id'], SingleFile> | null
    /**
     * @description
     * Three strategies
     * 1. append - add new files to the existing list. If a file with the same name exists, it will be ignored and not added again
     * 2. replace - add new files to the existing list. If a file with the same name exists, it will be replaced with the new one
     * 3. merge - add new files to the existing list. If a file with the same name exists, it will be added with a new name (e.g. "file.txt" -> "file-1.txt" etc.)
     */
    addFiles: (files: BaseFile[]) => void
    removeFile: (fileName: BaseFile['name']) => void
    removeFiles: () => void
  }
}

export const fileSlice = createSlice<FileStore>(set => ({
  fileSlice: {
    strategy: 'merge',
    updateStrategy: strategy =>
      set(state => {
        state.fileSlice.strategy = strategy
      }),
    files: null,
    addFiles: files =>
      set(state => {
        if (!state.fileSlice.files) state.fileSlice.files = {}

        switch (state.fileSlice.strategy) {
          case 'append':
            for (const file of files) {
              const fileId = getFileIdFromFileName(file.name)
              if (state.fileSlice.files[fileId]) continue
              state.fileSlice.files[fileId] = { ...file, id: fileId }
            }
            break
          case 'replace':
            for (const file of files) {
              const fileId = getFileIdFromFileName(file.name)
              state.fileSlice.files[fileId] = { ...file, id: fileId }
            }
            break
          case 'merge':
            for (const file of files) {
              const fileId = getFileIdFromFileName(file.name)

              let newFileName = file.name
              let newFileId = fileId
              let counter = 1
              while (state.fileSlice.files[newFileId]) {
                const fileSuffix = `-${counter}`
                const fileNameWithoutExtension = file.name.replace(
                  /\.[^/.]+$/,
                  '',
                )
                const fileIdWithoutExtension = getFileIdFromFileName(
                  fileNameWithoutExtension,
                )
                const extension = file.name.split('.').pop()
                const fileExtension = extension ? `.${extension}` : ''

                newFileId = `${fileIdWithoutExtension}${fileSuffix}${fileExtension}`
                newFileName = `${fileNameWithoutExtension}${fileSuffix}${fileExtension}`
                counter++
              }
              state.fileSlice.files[newFileId] = {
                ...file,
                id: newFileId,
                name: newFileName,
              }
            }
            break
          default:
            throw new Error(`Unknown strategy: ${state.fileSlice.strategy}`)
        }
      }),
    removeFile: fileName =>
      set(state => {
        if (state.fileSlice.files === null) return
        const fileId = getFileIdFromFileName(fileName)
        if (!state.fileSlice.files[fileId]) return
        delete state.fileSlice.files[fileId]
      }),
    removeFiles: () =>
      set(state => {
        state.fileSlice.files = null
      }),
  },
}))

function getFileIdFromFileName(fileName: string): string {
  return slugify(fileName, {
    lower: false,
    strict: false,
    replacement: '-',
    trim: true,
    locale: 'ru',
  })
}
