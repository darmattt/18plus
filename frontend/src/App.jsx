import { Routes, Route } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import Login from "./pages/LoginPage.jsx"
import Gruppe from "./pages/GruppePage.jsx"

import AppShell from "@/components/layout/AppShell"

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<LandingPage />} />

      {/* Worksheet Plattform */}
      <Route path="/arbeitsblaetter/*" element={<AppShell />} />

      <Route path="/LoginPage" element={<Login />} />
      <Route path="/GruppePage" element={<Gruppe />} />

    </Routes>
  )
}