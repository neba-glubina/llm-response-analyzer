import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Info } from 'lucide-react'
import { useStore } from '@/store'
import type { Store } from '@/store/model'
import { objectKeys } from '@/lib/utils'

const STRATEGIES = {
  append: {
    label: 'Добавить файлы',
    description:
      'Файлы будут добавлены к уже существующим. Если файл с таким именем уже существует, он не будет добавлен повторно',
  },
  replace: {
    label: 'Заменить файлы',
    description: 'Файлы заменят уже существующие с теми же именами',
  },
  merge: {
    label: 'Объединить файлы',
    description:
      'Файлы будут добавлены к уже существующим. Если файл с таким именем уже существует, он будет добавлен с новым именем (например, "file.txt" -> "file-1.txt" и т.д.)',
  },
} as const satisfies {
  [key in Store['calculationSlice']['strategy']]: {
    description: string
    label: string
  }
}

const STRATEGIES_KEYS = objectKeys(STRATEGIES)

export const Strategy = () => {
  const strategy = useStore(state => state.calculationSlice.strategy)
  const updateStrategy = useStore(
    state => state.calculationSlice.updateStrategy,
  )

  return (
    <div className='flex justify-between items-center gap-2'>
      <p>{STRATEGIES[strategy].description}</p>
      <Popover>
        <PopoverTrigger className='w-full' asChild>
          <Button
            variant='ghost'
            size='liquid'
            aria-label='Информация'
            className='max-h-max'>
            <Info />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-64'>
          <RadioGroup defaultValue={strategy} onValueChange={updateStrategy}>
            {STRATEGIES_KEYS.map(strategy => (
              <div key={strategy} className='flex items-center gap-2'>
                <RadioGroupItem value={strategy} id={strategy} />
                <Label htmlFor={strategy}>{STRATEGIES[strategy].label}</Label>
              </div>
            ))}
          </RadioGroup>
        </PopoverContent>
      </Popover>
    </div>
  )
}
