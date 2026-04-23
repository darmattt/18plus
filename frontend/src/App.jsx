import React, { useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
//import {LoginBox} from "./pages/LoginPage.jsx"
import GruppePage from "./pages/GruppePage.jsx"
import AdminLogIn from "./pages/AdminLogIn.jsx"

import AppShell from "@/components/layout/AppShell"

// OPTIONAL: if you later have these
// import AdminView from "./pages/AdminView"
import TeacherView from "./pages/TeacherView"

export default function App() {
  /*const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (email, password) => {
    console.log("Login attempt:", { email, password })

    // Example role logic (adjust if needed)
    if (email === "betreuer@gmail.com" && password === "12345") {
      setIsLoggedIn(true)
      navigate("/TeacherView") // 🔵 KEEP: AdminLogIn
    }
    else if (email === "student@gmail.com" && password === "676767") {
      setIsLoggedIn(true)
      navigate("/arbeitsblaetter") // 🔵 AppShell
    }
    else {
      alert("Falsche Login-Daten")
    }
  }
*/
  return (
    <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/arbeitsblaetter/*" element={<AppShell />} />
          <Route path="/GruppePage" element={<GruppePage />} />
          <Route path="/adminlogin" element={<AdminLogIn />} />
          <Route path="/TeacherView" element={<TeacherView />} />
        </Routes>
  )
}