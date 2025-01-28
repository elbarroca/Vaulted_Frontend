import { ThemeProvider } from "@/components/theme-provider"
import { RouterProvider } from "react-router-dom"
import { router } from "./routes"
import { WalletProvider } from "./contexts/WalletProvider"

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <WalletProvider>
        <RouterProvider router={router} />
      </WalletProvider>
    </ThemeProvider>
  )
}
