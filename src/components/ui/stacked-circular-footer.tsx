import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { motion } from "framer-motion"

function StackedCircularFooter() {
  return (
    <footer className="relative bg-background py-16 isolate overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-blue-500/[0.08] to-transparent" />
        <div className="absolute -left-[40%] aspect-square w-[80%] -translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-600/20 to-emerald-500/10 blur-3xl" />
        <div className="absolute -right-[40%] aspect-square w-[80%] translate-y-1/2 rounded-full bg-gradient-to-tl from-emerald-500/20 to-blue-600/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="group mb-12 rounded-full bg-gradient-to-br from-blue-600/20 to-emerald-500/20 p-8 transition-all duration-300 hover:from-blue-600/30 hover:to-emerald-500/30 shadow-lg hover:shadow-blue-500/20"
          >
            <Icons.logo className="icon-class w-8 transition-transform duration-300 group-hover:scale-110" />
          </motion.div>
          
          <nav className="mb-12 flex flex-wrap justify-center gap-8">
            {["Home", "About", "Services", "Products", "Contact"].map((item) => (
              <motion.a 
                key={item} 
                whileHover={{ scale: 1.05 }}
                href="#" 
                className="relative text-muted-foreground transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-blue-600 after:to-emerald-500 after:transition-all hover:after:w-full"
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 flex space-x-6"
          >
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: Twitter, label: "Twitter" },
              { Icon: Instagram, label: "Instagram" },
              { Icon: Linkedin, label: "LinkedIn" }
            ].map(({ Icon, label }) => (
              <Button 
                key={label}
                variant="outline" 
                size="icon" 
                className="rounded-full transition-all duration-300 hover:scale-110 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-emerald-500/20 hover:border-blue-500/50 shadow-sm hover:shadow-blue-500/20"
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{label}</span>
              </Button>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              © 2024 Vaulted. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}

export { StackedCircularFooter }