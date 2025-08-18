import { ThemeProvider } from '@/components/theme-provider'
import { HomeView } from '@/views/HomeView'
import { StoreProvider } from './store'

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <StoreProvider>
        <main className='flex flex-col justify-center items-center bg-background p-4 min-h-screen'>
          <HomeView />
        </main>
      </StoreProvider>
    </ThemeProvider>
  )
}

export default App
