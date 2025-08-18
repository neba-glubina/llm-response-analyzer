import { useStore } from '@/store'
import { useDropzone } from 'react-dropzone'
import { Button } from '../../../../components/ui/button'
import { X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import Papa from 'papaparse'

export function Dropzone() {
  const files = useStore(state => state.calculationSlice.files)
  const addFiles = useStore(state => state.calculationSlice.addFiles)
  const removeFile = useStore(state => state.calculationSlice.removeFile)
  const removeFiles = useStore(state => state.calculationSlice.removeFiles)

  const onDrop = async (acceptedFiles: File[]) => {
    const parsedFiles = await Promise.all(
      acceptedFiles.map(file => file.text()),
    )

    const files = acceptedFiles.map(({ name, size, lastModified }, index) => ({
      name,
      size,
      lastModified,
      content: Papa.parse(parsedFiles[index])
        .data.map(row => (Array.isArray(row) ? row[0] || '' : ''))
        .filter(Boolean),
    }))

    addFiles(files)
    return true
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const filesArray = files ? Object.values(files) : []

  return (
    <div>
      <div
        {...getRootProps({
          className:
            'min-h-[5.25rem] flex items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer',
          role: 'button',
          'aria-label': 'Область для перетаскивания файлов',
        })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Перетащите файлы сюда...</p>
        ) : (
          <p>Перетащите файлы сюда или нажмите для выбора файлов</p>
        )}
      </div>
      {filesArray.length > 0 && (
        <div className='mt-4'>
          <div className='flex justify-between items-center'>
            <p className='text-muted-foreground text-sm'>
              Выбранные файлы{' '}
              <span className='text-muted-foreground text-xs'>
                (
                {filesArray.reduce(
                  (total, { content }) => total + content.length,
                  0,
                )}{' '}
                запросов)
              </span>
              :
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label='Очистить файлы'
                  title='Очистить файлы'>
                  <X />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Очистить файлы?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы уверены, что хотите очистить список файлов? Это действие
                    нельзя будет отменить.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={removeFiles}>
                    Очистить файлы
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <ul className='flex flex-col gap-2 p-0'>
            {filesArray.map(file => (
              <li
                key={file.name}
                className='flex flex-wrap justify-between items-center gap-2'>
                <p>
                  {file.name}{' '}
                  <span className='text-muted-foreground text-xs'>
                    ({file.content.length})
                  </span>
                </p>
                <Button
                  onClick={() => removeFile(file.name)}
                  variant='ghost'
                  size='icon'
                  aria-label='Удалить файл'
                  title='Удалить файл'>
                  <X />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
