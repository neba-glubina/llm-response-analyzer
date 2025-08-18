import { AiSelectList } from '@/widgets/Calculation/ui/ai-select-list'
import { Dropzone } from '@/widgets/Calculation/ui/file'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Strategy } from './ui/strategy'

export const Calculation = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Расчёт</CardTitle>
        <CardDescription>
          <Strategy />
        </CardDescription>
      </CardHeader>
      <CardContent className='gap-4 grid'>
        <Dropzone />
      </CardContent>
      <CardFooter className='flex justify-between items-center gap-2'>
        <Button>Отправить</Button>
        <AiSelectList />
      </CardFooter>
    </Card>
  )
}
