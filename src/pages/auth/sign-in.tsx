import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)
      navigate("/dashboard")
    }, 1000)
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="absolute left-4 top-4 md:left-8 md:top-8"
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Button>
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-emerald-600" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.vaulted className="mr-2 h-6 w-6" />
          Vaulted
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Vaulted has revolutionized how we handle our data storage. It's secure,
              fast, and incredibly user-friendly."
            </p>
            <footer className="text-sm">Sofia Davis, CTO at Acme Inc</footer>
          </blockquote>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:p-8"
      >
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  required
                />
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" disabled={isLoading}>
              <Icons.gitHub className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline" disabled={isLoading}>
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
          <Button 
            variant="outline" 
            disabled={isLoading} 
            className={cn(
              "w-full gap-2 relative group",
              "bg-background hover:bg-accent",
              "border-input hover:border-accent", 
              "h-12"
            )}
          >
            <span role="img" aria-label="wallet" className="text-xl relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
            👤
            </span>
            <span className="font-medium relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-400">
              Connect Wallet
            </span>
            <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <Icons.arrowRight className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            </div>
          </Button>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button 
              variant="link" 
              className="underline underline-offset-4 hover:text-primary"
              onClick={() => navigate("/auth/sign-up")}
            >
              Sign up
            </Button>
          </p>
        </div>
      </motion.div>
    </div>
  )
} 