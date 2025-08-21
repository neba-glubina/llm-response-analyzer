import { ThemeProvider } from "@/components/theme-provider";
import { HomeView } from "@/views/HomeView";
import { StoreProvider, useStore } from "./store";
import { LoginScreen } from "@/widgets/Auth/LoginScreen";
import { useEffect } from "react";

function AppContent() {
  const isAuthenticated = useStore((s) => s.auth.isAuthenticated);
  const setAuthenticated = useStore((s) => s.auth.setAuthenticated);

  useEffect(() => {
    // Probe session via cookie without raising 401
    fetch("/api/v1/auth/status", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setAuthenticated(Boolean(data?.authenticated));
      })
      .catch(() => setAuthenticated(false));
  }, [setAuthenticated]);

  return (
    <main className="flex flex-col justify-center items-center bg-background p-4 min-h-screen">
      {isAuthenticated ? <HomeView /> : <LoginScreen />}
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
