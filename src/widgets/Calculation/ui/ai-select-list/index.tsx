import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Checkbox } from '../../../../components/ui/checkbox'

const AI_LIST = [
  { value: 'gpt-3.5', label: 'GPT-3.5' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'claude-2', label: 'Claude 2' },
  { value: 'claude-instant', label: 'Claude Instant' },
] as const

export function AiSelectList() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline'>Выбрать AI</Button>
      </PopoverTrigger>
      <PopoverContent className='w-64'>
        {AI_LIST.length > 0 && (
          <ul className='space-y-2 mt-2'>
            {AI_LIST.map(ai => (
              <li
                key={ai.value}
                className='flex flex-wrap items-center gap-2 p-2 cursor-pointer'>
                <Checkbox />
                <span>{ai.label}</span>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}
