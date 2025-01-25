"use client";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Header1() {
    const navigationItems = [
        {
            title: "Home",
            href: "/",
        },
        {
            title: "Manifesto",
            href: "/manifesto",
        },
        {
            title: "Features",
            href: "/features",
        },
    ];

    const [isOpen, setOpen] = useState(false);
    
    return (
        <motion.header 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full z-40 fixed top-0 left-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900/80 backdrop-blur-xl border-b border-blue-600/20 shadow-[0_2px_8px_rgba(59,130,246,0.15)] dark:shadow-[0_2px_8px_rgba(59,130,246,0.25)]"
        >
            <div className="container relative mx-auto h-20 flex items-center justify-between px-4">
                {/* Logo */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 100 }}
                    className="flex items-center"
                >
                    <a 
                        href="/" 
                        className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-600 to-emerald-400 hover:from-blue-300 hover:via-blue-500 hover:to-emerald-300 transition-all duration-300 hover:scale-105"
                    >
                        Vaulted
                    </a>
                </motion.div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-2">
                    <NavigationMenu>
                        <NavigationMenuList className="flex gap-8">
                            {navigationItems.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
                                >
                                    <NavigationMenuItem>
                                        <NavigationMenuLink href={item.href}>
                                            <Button 
                                                variant="ghost" 
                                                className="relative text-sm font-medium text-blue-100/80 hover:text-blue-200 transition-colors hover:bg-blue-600/10 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-blue-600 after:to-emerald-500 after:transition-all hover:after:w-full"
                                            >
                                                {item.title}
                                            </Button>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                </motion.div>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </nav>

                {/* Action Buttons */}
                <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5, type: "spring", stiffness: 100 }}
                    className="flex items-center gap-4"
                >
                    <GradientButton 
                        className="hidden lg:flex bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
                        variant="default"
                        size="default"
                    >
                        Get Started
                    </GradientButton>
                    
                    {/* Mobile Menu Button */}
                    <Button 
                        variant="ghost" 
                        className="lg:hidden text-blue-100/80 hover:text-blue-200 hover:bg-blue-600/10"
                        onClick={() => setOpen(!isOpen)}
                    >
                        <motion.div
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </motion.div>
                    </Button>
                </motion.div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
                            className="absolute top-full left-0 right-0 border-t border-blue-600/20 bg-slate-900/95 backdrop-blur-xl py-4 lg:hidden shadow-lg"
                        >
                            <nav className="container flex flex-col gap-2">
                                {navigationItems.map((item, index) => (
                                    <motion.a
                                        key={item.title}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                                        href={item.href}
                                        className="flex items-center justify-between px-4 py-2 text-blue-100/80 hover:text-blue-200 hover:bg-blue-600/10 rounded-lg transition-colors"
                                        onClick={() => setOpen(false)}
                                    >
                                        <span className="text-sm font-medium">{item.title}</span>
                                        <MoveRight className="w-4 h-4" />
                                    </motion.a>
                                ))}
                                <div className="px-4 pt-4 mt-2 border-t border-blue-600/20">
                                    <GradientButton 
                                        className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
                                        variant="default"
                                        size="default"
                                    >
                                        Get Started
                                    </GradientButton>
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
}

export { Header1 };