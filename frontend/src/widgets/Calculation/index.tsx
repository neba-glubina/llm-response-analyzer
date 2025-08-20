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
import { useCalculation } from './api'
import { LoaderIcon } from 'lucide-react'

export const Calculation = () => {
  const { triggerCalculation, calculationIsLoading, calculationError } =
    useCalculation()

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
        <div>
          <Button onClick={triggerCalculation} disabled={calculationIsLoading}>
            {calculationIsLoading ? (
              <>
                <LoaderIcon /> Отправляется...
              </>
            ) : (
              'Отправить'
            )}
          </Button>
          {calculationError && (
            <p>
              {typeof calculationError === 'string'
                ? calculationError
                : new Error(calculationError).message}
            </p>
          )}
        </div>
        <AiSelectList />
      </CardFooter>
    </Card>
  )
}
