import { LandingPage } from "@/pages/landing"
import { SignInPage } from "@/pages/auth/sign-in"
import { SignUpPage } from "@/pages/auth/sign-up"
import { DashboardPage } from "@/pages/dashboard"
import { ReferralPage } from "@/pages/dashboard/referral"
import { DocumentPage } from "@/pages/document"
import { createBrowserRouter } from "react-router-dom"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/auth/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/auth/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/dashboard/shared",
    element: <DashboardPage />,
  },
  {
    path: "/dashboard/recent",
    element: <DashboardPage />,
  },
  {
    path: "/dashboard/starred",
    element: <DashboardPage />,
  },
  {
    path: "/dashboard/trash",
    element: <DashboardPage />,
  },
  {
    path: "/dashboard/referral",
    element: <ReferralPage />,
  },
  {
    path: "/document/new",
    element: <DocumentPage />,
  },
  {
    path: "/document/:id",
    element: <DocumentPage />,
  }
]) 