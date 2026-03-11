import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import ContentSidebar from "@/components/layout/ContentSidebar"
import BottomNav from "@/components/layout/BottomNav"
import WorksheetRenderer from "@/components/WorksheetRenderer"
import { modules } from "@/data/modules"

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState("content")
  const [activeWorksheetId, setActiveWorksheetId] = useState("ws-offene-fragen")
  const [expandedModules, setExpandedModules] = useState([
    "Modul 1: Berufsorientierung - Arbeitsblätter",
  ])
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

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h1 className="text-3xl font-bold text-slate-900">Mein Profil</h1>
            </div>
          ) : (
            <WorksheetRenderer worksheetId={activeWorksheetId} />
          )}
        </motion.div>
      </main>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-28 right-4 z-50 w-[360px] rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-slate-900">Chat</h3>
            <p className="mt-2 text-sm text-slate-600">
              Hier kommt später dein ChatBot rein.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav
        sidebarOpen={sidebarOpen}
        activeView={activeView}
        chatOpen={chatOpen}
        onToggleSidebar={() => {
          setSidebarOpen((prev) => !prev)
          setActiveView("content")
        }}
        onOpenProfile={() => {
          setActiveView("profile")
          setSidebarOpen(false)
          setChatOpen(false)
        }}
        onToggleChat={() => {
          setChatOpen((prev) => !prev)
          setSidebarOpen(false)
        }}
      />
    </div>
  )
}