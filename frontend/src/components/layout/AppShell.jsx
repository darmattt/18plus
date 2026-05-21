import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import ContentSidebar from "@/components/layout/ContentSidebar"
import BottomNav from "@/components/layout/BottomNav"
import WorksheetRenderer from "@/components/WorksheetRenderer"
import { modules } from "@/data/modules"
import { ProfileView } from "@/pages/ProfileView"
import { ChatBot } from "@/pages/ChatBot"

import { LoginBox } from "@/pages/LoginPage.jsx"
import { loginTeacher, setTeacherToken } from "@/api/teacherApi"
import { verifyStudentLoginCode } from "@/api/studentApi"
import { useNavigate } from "react-router-dom"
import { RegistrationBox } from "@/pages/RegistrationPage.jsx"

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState("content")
  const [activeWorksheetId, setActiveWorksheetId] = useState("ws-offene-fragen")
  const [expandedModules, setExpandedModules] = useState([
    "Modul 1: Berufsorientierung - Arbeitsblätter",
  ])

    const [showLogin, setShowLogin] = useState(false)
    const navigate = useNavigate()
const [showRegistration, setShowRegistration] = useState(false)

  const [chatOpen, setChatOpen] = useState(false)

  const toggleModule = (title) => {
    setExpandedModules((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    )
  }

  const handleSelectWorksheet = (worksheetId) => {
    setActiveWorksheetId(worksheetId)
    setActiveView("content")
    setSidebarOpen(false)
    setChatOpen(false)
  }

    const handleLogin = async (role, email, passwordOrCode) => {
          try {
            if (role === "teacher") {
              const result = await loginTeacher(email, passwordOrCode)
              const token = result.token || result.jwt || result.accessToken

              if (!token) {
                console.log("Teacher login response:", result)
                throw new Error("Kein Teacher-Token gefunden")
              }

              setTeacherToken(token)
              setShowLogin(false)
              navigate("/TeacherView")
              return
            }

            if (role === "student") {
              await verifyStudentLoginCode(email, passwordOrCode)
              setIsLoggedIn(true)
              setShowLogin(false)
              navigate("/arbeitsblaetter")
              return
            }
          } catch (error) {
            alert(error.message)
          }
        }

    const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

        <button
          onClick={() => setShowLogin(true)}
          className="fixed right-6 top-6 z-30 rounded-xl bg-[#006ddd] px-5 py-3 font-bold text-white shadow-lg transition-colors hover:bg-[#005bb8]"
        >
          Login
        </button>

      <ContentSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        modules={modules}
        expandedModules={expandedModules}
        toggleModule={toggleModule}
        activeWorksheetId={activeWorksheetId}
        onSelectWorksheet={handleSelectWorksheet}
      />

      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-6 md:px-8 md:pt-10">
        <motion.div
          key={activeView + activeWorksheetId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-6xl"
        >
          {activeView === "profile" ? (
            <ProfileView />
          ) : (
            <WorksheetRenderer worksheetId={activeWorksheetId} />
          )}
        </motion.div>
      </main>

      <AnimatePresence>
        {chatOpen && (
            <ChatBot onClose={() => setChatOpen(false)} />
          )}
      </AnimatePresence>

      <BottomNav
          sidebarOpen={sidebarOpen}
          activeView={activeView}
          chatOpen={chatOpen}
          isLoggedIn={isLoggedIn}
          onToggleSidebar={() => {
            setSidebarOpen((prev) => !prev)
            setActiveView("content")
          }}
          onOpenProfile={() => {
            if (!isLoggedIn) return
            setActiveView("profile")
            setSidebarOpen(false)
            setChatOpen(false)
          }}
          onToggleChat={() => {
            if (!isLoggedIn) return
            setChatOpen((prev) => !prev)
            setSidebarOpen(false)
          }}
        />


    {!isLoggedIn && (
      <button
        onClick={() => setShowLogin(true)}
        className="fixed right-6 top-6 z-30 rounded-xl bg-[#006ddd] px-5 py-3 font-bold text-white shadow-lg hover:bg-[#005bb8]"
      >
        Login
      </button>
    )}

      {showLogin && (
        <LoginBox
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
          onRegister={() => {
            setShowLogin(false)
            setShowRegistration(true)
          }}
        />
      )}

        {showRegistration && (
          <RegistrationBox
            onClose={() => setShowRegistration(false)}
            onRegisterSuccess={() => {
              setShowRegistration(false)
              setShowLogin(true)
            }}
            onBackToLogin={() => {
              setShowRegistration(false)
              setShowLogin(true)
            }}
          />
        )}
    </div>
  )
}