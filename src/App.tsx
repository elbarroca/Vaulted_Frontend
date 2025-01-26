import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Routes } from "./routes"
import { ReferralPage } from "@/pages/dashboard/referral"

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vaulted-ui-theme">
        <Routes />
      </ThemeProvider>
    </BrowserRouter>
  )
}
