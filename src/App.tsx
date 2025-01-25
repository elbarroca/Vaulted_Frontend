import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Routes } from "./routes"

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vaulted-ui-theme">
        <Routes />
      </ThemeProvider>
    </BrowserRouter>
  )
}
