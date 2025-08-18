import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Report = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Отчёт</CardTitle>
        <CardDescription>Отчёт о ваших данных</CardDescription>
      </CardHeader>
      <CardContent className='gap-4 grid'>
        <div className='gap-3 grid'>
          <Label htmlFor='tabs-demo-current'>Current password</Label>
          <Input id='tabs-demo-current' type='password' />
        </div>
        <div className='gap-3 grid'>
          <Label htmlFor='tabs-demo-new'>New password</Label>
          <Input id='tabs-demo-new' type='password' />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Сохранить</Button>
      </CardFooter>
    </Card>
  )
}
