import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import ContentSidebar from "@/components/layout/ContentSidebar"
import BottomNav from "@/components/layout/BottomNav"
import WorksheetRenderer from "@/components/WorksheetRenderer"
import { modules } from "@/data/modules"
import { ProfileView } from "@/pages/ProfileView"
import { ChatBot } from "@/pages/ChatBot"

import { LoginBox } from "@/pages/LoginPage.jsx"
import { loginTeacher, setTeacherToken } from "@/api/teacherApi"
import {
  getEnabledWorksheets,
  getStudentProfile,
  getStudentToken,
  logoutStudent,
  verifyStudentLoginCode,
} from "@/api/studentApi"
import { useNavigate } from "react-router-dom"
import { RegistrationBox } from "@/pages/RegistrationPage.jsx"

const STUDENT_SESSION_KEY = "studentSession"

function readStudentSession() {
  try {
    const raw = localStorage.getItem(STUDENT_SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeStudentSession(user) {
  localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(user))
}

function clearStudentSession() {
  localStorage.removeItem(STUDENT_SESSION_KEY)
}

function mapStudentProfile(profile) {
  return {
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.emailAddress || "",
    groupName: profile?.groupName || null,
    teacherName: profile?.teacherName || null,
  }
}

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState("content")
  const [activeWorksheetId, setActiveWorksheetId] = useState("ws-wegweiser-intro")
  const [expandedModules, setExpandedModules] = useState([
    "Modul 1: Berufsorientierung - Arbeitsblätter",
  ])
  const [showLogin, setShowLogin] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => readStudentSession())
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getStudentToken()))
  const [enabledSlugs, setEnabledSlugs] = useState(null)
  const navigate = useNavigate()

  const loadEnabledWorksheets = async () => {
    try {
      const slugs = await getEnabledWorksheets()
      setEnabledSlugs(new Set(Array.isArray(slugs) ? slugs : []))
    } catch (error) {
      console.error("Failed to load enabled worksheets", error)
    }
  }

  useEffect(() => {
    if (currentUser) {
      writeStudentSession(currentUser)
      return
    }

    clearStudentSession()
  }, [currentUser])

  useEffect(() => {
    const token = getStudentToken()

    if (!token) {
      setIsLoggedIn(false)
      setCurrentUser(null)
      return
    }

    let cancelled = false

    async function refreshStudentProfile() {
      try {
        const profile = await getStudentProfile()

        if (!cancelled) {
          setCurrentUser(mapStudentProfile(profile))
          setIsLoggedIn(true)
          loadEnabledWorksheets()
        }
      } catch (error) {
        if (!cancelled) {
          logoutStudent()
          setCurrentUser(null)
          setIsLoggedIn(false)
        }

        console.error("Student profile refresh failed", error)
      }
    }

    refreshStudentProfile()

    return () => {
      cancelled = true
    }
  }, [])

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
        const profile = await getStudentProfile()

        setCurrentUser(mapStudentProfile(profile))
        setIsLoggedIn(true)
        loadEnabledWorksheets()
        setShowLogin(false)
        navigate("/arbeitsblaetter")
      }
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {!isLoggedIn && (
        <button
          onClick={() => setShowLogin(true)}
          className="fixed right-6 top-6 z-30 rounded-xl bg-[#006dd6] px-5 py-3 font-bold text-white shadow-lg transition-colors hover:bg-[#005bb8]"
        >
          Login
        </button>
      )}

      <ContentSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        modules={modules}
        expandedModules={expandedModules}
        toggleModule={toggleModule}
        activeWorksheetId={activeWorksheetId}
        onSelectWorksheet={handleSelectWorksheet}
        enabledSlugs={enabledSlugs}
      />

      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-6 md:px-8 md:pt-10">
        <motion.div
          key={activeView + activeWorksheetId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-6xl"
        >
          {activeView === "profile" ? (
            <ProfileView user={currentUser} />
          ) : (
            <WorksheetRenderer worksheetId={activeWorksheetId} />
          )}
        </motion.div>
      </main>

      <AnimatePresence>
        {chatOpen && <ChatBot onClose={() => setChatOpen(false)} />}
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
          onRegisterSuccess={async () => {
            setShowRegistration(false)

            try {
              const profile = await getStudentProfile()
              setCurrentUser(mapStudentProfile(profile))
              setIsLoggedIn(true)
              loadEnabledWorksheets()
              navigate("/arbeitsblaetter")
            } catch (error) {
              console.error("Failed to load profile after registration", error)
              setShowLogin(true)
            }
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