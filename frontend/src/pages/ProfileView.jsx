import React, { useEffect, useState } from "react"
import {
  Mail,
  Users,
  UserCheck,
  Trophy,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react"

import { modules } from "@/data/modules"
import { getAllWorksheetResults } from "@/api/studentApi"

// WorkingStatus enum from the backend, serialized as its name (Draft/InProgress/Submitted/Cancelled)
function mapStatus(workingStatus) {
  if (workingStatus === "Submitted") return "completed"
  if (workingStatus === "InProgress") return "in-progress"
  return "not-started"
}

export const ProfileView = ({ user, onSelectWorksheet }) => {
  const [worksheets, setWorksheets] = useState(() =>
    modules.flatMap((module) =>
      module.sheets.map((sheet) => ({
        id: sheet.id,
        name: sheet.title,
        status: "not-started",
      }))
    )
  )

  useEffect(() => {
    let cancelled = false

    async function loadResults() {
      try {
        const results = await getAllWorksheetResults()
        if (cancelled) return

        const statusBySlug = new Map(results.map((r) => [r.slug, mapStatus(r.status)]))

        setWorksheets(
          modules.flatMap((module) =>
            module.sheets.map((sheet) => ({
              id: sheet.id,
              name: sheet.title,
              status: statusBySlug.get(sheet.id) ?? "not-started",
            }))
          )
        )
      } catch (error) {
        console.error("Failed to load worksheet progress", error)
      }
    }

    loadResults()

    return () => {
      cancelled = true
    }
  }, [])

  const completedCount = worksheets.filter(
    (w) => w.status === "completed"
  ).length

  const totalCount = worksheets.length

  const completionPercentage = Math.round(
    (completedCount / totalCount) * 100
  )

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12 sm:space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-[#00a7e7] via-[#006dd6] to-[#c7d300] sm:h-32" />

        <div className="px-4 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {user?.firstName} {user?.lastName}
              </h1>

              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500 sm:text-base">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 text-[#006dd6]">
            <Users className="w-5 h-5" />
            <h3 className="font-bold">
              {user?.groupName ? "Meine Gruppe" : "Keine Gruppe"}
            </h3>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-lg font-bold text-gray-900">
              {user?.groupName }
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 text-[#00a7e7]">
            <UserCheck className="w-5 h-5" />
            <h3 className="font-bold">
              {user?.groupName ? "Lehrperson" : "Keine Lehrperson"}
            </h3>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-900 text-center">
              {user?.teacherName }
            </p>

          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3 text-[#c7d300]">
            <Trophy className="w-5 h-5" />
            <h3 className="font-bold">Arbeitsblätter erfüllt</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-gray-900">
                {completionPercentage}%
              </span>

              <span className="text-sm text-gray-500">
                {completedCount} von {totalCount}
              </span>
            </div>

            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c7d300] transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-xl">
            Meine Arbeitsblätter
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {worksheets.map((worksheet, i) => {
            const getStatusConfig = (status) => {
              switch (status) {
                case "completed":
                  return {
                    label: "Erledigt",
                    icon: CheckCircle,
                    color: "text-green-600",
                    bg: "bg-green-100",
                  }

                case "in-progress":
                  return {
                    label: "In Arbeit",
                    icon: Clock,
                    color: "text-[#00a7e7]",
                    bg: "bg-[#00a7e7]/10",
                  }

                case "not-started":
                  return {
                    label: "Nicht erledigt",
                    icon: FileText,
                    color: "text-gray-500",
                    bg: "bg-gray-100",
                  }

                default:
                  return {
                    label: "Unbekannt",
                    icon: FileText,
                    color: "text-gray-500",
                    bg: "bg-gray-100",
                  }
              }
            }

            const config = getStatusConfig(worksheet.status)
            const StatusIcon = config.icon

            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelectWorksheet?.(worksheet.id)}
                className="flex w-full flex-col gap-4 p-4 text-left transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="flex flex-1 items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg}`}
                  >
                    <StatusIcon
                      className={`w-6 h-6 ${config.color}`}
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900">
                      {worksheet.name}
                    </h4>
                  </div>
                </div>

                <div className={`self-start rounded-lg px-4 py-2 sm:self-auto ${config.bg}`}>
                  <span
                    className={`text-sm font-bold ${config.color}`}
                  >
                    {config.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
