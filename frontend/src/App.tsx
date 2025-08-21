import { ThemeProvider } from "@/components/theme-provider";
import { HomeView } from "@/views/HomeView";
import { StoreProvider, useStore } from "./store";
import { LoginScreen } from "@/widgets/Auth/LoginScreen";

function AppContent() {
  const token = useStore((s) => s.auth.token);
  return (
    <main className="flex flex-col justify-center items-center bg-background p-4 min-h-screen">
      {token ? <HomeView /> : <LoginScreen />}
    </main>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </ThemeProvider>
  );
}

export default App;
