import React, { useState } from "react"
import { Users, UserCog, GraduationCap } from "lucide-react"

import { TeacherAdminManagement } from "./TeacherAdminManagement"
import { GroupManagement } from "./GroupManagement"
import { StudentProgressManagement } from "./StudentProgressManagement"

export const AdminView = () => {
  const [activeTab, setActiveTab] = useState("teachers")

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Admin-Bereich
          </h1>

          <p className="text-gray-600 mt-1">
            Verwaltung von Betreuer:innen und Lerngruppen
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {activeTab === "teachers" ? (
            <TeacherAdminManagement />
          ) : activeTab === "groups" ? (
            <GroupManagement />
          ) : (
            <StudentProgressManagement />
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setActiveTab("teachers")}
              className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold transition-all ${
                activeTab === "teachers"
                  ? "bg-[#006dd6] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <UserCog className="w-5 h-5" />

              <span className="hidden sm:inline">
                Betreuer:innen
              </span>

              <span className="sm:hidden text-xs">
                Betreuer:in
              </span>
            </button>

            <button
              onClick={() => setActiveTab("groups")}
              className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold transition-all ${
                activeTab === "groups"
                  ? "bg-[#006dd6] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Users className="w-5 h-5" />

              <span className="hidden sm:inline">
                Lerngruppen
              </span>

              <span className="sm:hidden text-xs">
                Gruppen
              </span>
            </button>

            <button
              onClick={() => setActiveTab("students")}
              className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold transition-all ${
                activeTab === "students"
                  ? "bg-[#006dd6] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <GraduationCap className="w-5 h-5" />

              <span className="hidden sm:inline">
                Schüler:innen
              </span>

              <span className="sm:hidden text-xs">
                Schüler:in
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}