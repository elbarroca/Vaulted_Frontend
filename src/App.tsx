import { ThemeProvider } from "@/components/theme-provider"
import { RouterProvider } from "react-router-dom"
import { router } from "./routes"

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
