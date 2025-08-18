import { createSlice } from '@/store/utils'
import slugify from 'slugify'

type BaseFile = { readonly content: string[] } & Pick<
  File,
  'name' | 'size' | 'lastModified'
>

type SingleFile = { readonly id: string } & BaseFile

type BaseAI = {
  readonly value: string
  readonly label: string
}

export type FileStore = {
  calculationSlice: {
    ais: Record<BaseAI['value'], BaseAI> | null
    updateAIs: (ai: BaseAI) => void
    strategy: 'append' | 'replace' | 'merge'
    updateStrategy: (
      strategy: FileStore['calculationSlice']['strategy'],
    ) => void
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
  calculationSlice: {
    ais: null,
    updateAIs: ai =>
      set(state => {
        if (!state.calculationSlice.ais) state.calculationSlice.ais = {}
        if (state.calculationSlice.ais[ai.value]) {
          delete state.calculationSlice.ais[ai.value]
        } else {
          state.calculationSlice.ais[ai.value] = ai
        }
      }),
    strategy: 'merge',
    updateStrategy: strategy =>
      set(state => {
        state.calculationSlice.strategy = strategy
      }),
    files: null,
    addFiles: files =>
      set(state => {
        if (!state.calculationSlice.files) state.calculationSlice.files = {}

        switch (state.calculationSlice.strategy) {
          case 'append':
            for (const file of files) {
              const fileId = getFileIdFromFileName(file.name)
              if (state.calculationSlice.files[fileId]) continue
              state.calculationSlice.files[fileId] = { ...file, id: fileId }
            }
            break
          case 'replace':
            for (const file of files) {
              const fileId = getFileIdFromFileName(file.name)
              state.calculationSlice.files[fileId] = { ...file, id: fileId }
            }
            break
          case 'merge':
            for (const file of files) {
              const fileId = getFileIdFromFileName(file.name)

              let newFileName = file.name
              let newFileId = fileId
              let counter = 1
              while (state.calculationSlice.files[newFileId]) {
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
              state.calculationSlice.files[newFileId] = {
                ...file,
                id: newFileId,
                name: newFileName,
              }
            }
            break
          default:
            throw new Error(
              `Unknown strategy: ${state.calculationSlice.strategy}`,
            )
        }
      }),
    removeFile: fileName =>
      set(state => {
        if (state.calculationSlice.files === null) return
        const fileId = getFileIdFromFileName(fileName)
        if (!state.calculationSlice.files[fileId]) return
        delete state.calculationSlice.files[fileId]
      }),
    removeFiles: () =>
      set(state => {
        state.calculationSlice.files = null
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
