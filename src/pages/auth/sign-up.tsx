import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { motion } from "framer-motion"

export function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate registration
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
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600 to-blue-600" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.vaulted className="mr-2 h-6 w-6" />
          Vaulted
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Join thousands of users who trust Vaulted for secure, reliable, and
              efficient cloud storage solutions."
            </p>
            <footer className="text-sm">Alex Chen, Lead Developer at TechCorp</footer>
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
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Input
                  id="name"
                  placeholder="Full Name"
                  type="text"
                  autoCapitalize="words"
                  disabled={isLoading}
                  required
                />
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
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                />
                <Input
                  id="confirm-password"
                  placeholder="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign Up
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
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button 
              variant="link" 
              className="underline underline-offset-4 hover:text-primary"
              onClick={() => navigate("/auth/sign-in")}
            >
              Sign in
            </Button>
          </p>
        </div>
      </motion.div>
    </div>
  )
} 