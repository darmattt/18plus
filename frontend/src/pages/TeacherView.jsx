import React, { useState } from "react"
import { Users, ClipboardCheck } from "lucide-react"
import { TeacherGroupManagement } from "./TeacherGroupManagement"
import { StudentResults } from "./StudentResults"

export const TeacherView = () => {
  const [activeTab, setActiveTab] = useState("groups")

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900">Betreuer-Bereich</h1>
          <p className="text-gray-600 mt-1">
            Verwaltung Ihrer Gruppen und Schülerergebnisse
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {activeTab === "groups" ? <TeacherGroupManagement /> : <StudentResults />}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setActiveTab("groups")}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
                activeTab === "groups"
                  ? "bg-[#006ddd] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Users className="w-5 h-5" />
              Meine Gruppen
            </button>

            <button
              onClick={() => setActiveTab("results")}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
                activeTab === "results"
                  ? "bg-[#006ddd] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ClipboardCheck className="w-5 h-5" />
              Schülerergebnisse
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}