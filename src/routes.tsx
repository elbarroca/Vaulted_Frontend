import { Routes as RouterRoutes, Route } from "react-router-dom"
import { LandingPage } from "@/pages/landing"
import { SignInPage } from "@/pages/auth/sign-in"
import { SignUpPage } from "@/pages/auth/sign-up"
import { DashboardPage } from "@/pages/dashboard"
import { ReferralPage } from "@/pages/dashboard/referral"

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/sign-in" element={<SignInPage />} />
      <Route path="/auth/sign-up" element={<SignUpPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/shared" element={<DashboardPage />} />
      <Route path="/dashboard/recent" element={<DashboardPage />} />
      <Route path="/dashboard/starred" element={<DashboardPage />} />
      <Route path="/dashboard/trash" element={<DashboardPage />} />
      <Route path="/dashboard/referral" element={<ReferralPage />} />
    </RouterRoutes>
  )
} 