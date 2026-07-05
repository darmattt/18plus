import React from "react"
import {
  Mail,
  Users,
  UserCheck,
  Trophy,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react"

export const ProfileView = ({user}) => {
  const worksheets = [
    { name: "Modul 1: Arbeitsblatt 1", status: "completed" },
    { name: "Modul 1: Arbeitsblatt 2", status: "completed" },
    { name: "Modul 1: Arbeitsblatt 3", status: "in-progress" },
    { name: "Modul 1: Arbeitsblatt 4", status: "not-started" },
    { name: "Modul 2: Arbeitsblatt 1", status: "completed" },
    { name: "Modul 2: Arbeitsblatt 2", status: "not-started" },
    { name: "Modul 2: Arbeitsblatt 3", status: "not-started" },
    { name: "Modul 3: Arbeitsblatt 1", status: "not-started" },
  ]

  const completedCount = worksheets.filter(
    (w) => w.status === "completed"
  ).length

  const totalCount = worksheets.length

  const completionPercentage = Math.round(
    (completedCount / totalCount) * 100
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#00a7e7] via-[#006dd6] to-[#c7d300]" />

        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden shadow-lg">
              <img
                src="https://images-prod.dazeddigital.com/355/azure/dazed-prod/1060/8/1068776.jpg"
                alt="Profil"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h1>

              <p className="text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                Profil bearbeiten
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
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
              <div
                key={i}
                className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg}`}
                  >
                    <StatusIcon
                      className={`w-6 h-6 ${config.color}`}
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900">
                      {worksheet.name}
                    </h4>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-lg ${config.bg}`}>
                  <span
                    className={`text-sm font-bold ${config.color}`}
                  >
                    {config.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
