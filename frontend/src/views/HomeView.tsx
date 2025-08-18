import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ReactNode } from 'react'
import { Calculation } from '@/widgets/Calculation'
import { Report } from '@/widgets/Report'

const TABS = [
  {
    value: 'calculation',
    label: 'Расчёт',
    Content: Calculation,
  },
  {
    value: 'report',
    label: 'Отчёт',
    Content: Report,
  },
] as const satisfies {
  value: string
  label: string
  Content: () => ReactNode
}[]

export function HomeView() {
  return (
    <div className='flex flex-col gap-6 w-full max-w-sm'>
      <Tabs defaultValue={TABS[0].value}>
        <TabsList>
          {TABS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            <tab.Content />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
