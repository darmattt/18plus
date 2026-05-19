import React, { useState } from "react"
import {
  Search,
  User,
  Mail,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react"

export const StudentProgressManagement = () => {
  const [students, setStudents] = useState([
    {
      studentId: "s1",
      studentName: "Max Mustermann",
      email: "max.mustermann@student.de",
      groupName: "Klasse 9A",
      worksheetsCompleted: 3,
      worksheetsTotal: 8,
      averageScore: 85,
      lastActivity: "2026-05-08",
      results: [
        {
          id: "1",
          worksheetName: "Modul 1: Arbeitsblatt 1",
          status: "Submitted",
          score: 85,
          submittedAt: "2026-04-15",
        },
        {
          id: "2",
          worksheetName: "Modul 1: Arbeitsblatt 2",
          status: "Submitted",
          score: 92,
          submittedAt: "2026-04-20",
        },
        {
          id: "3",
          worksheetName: "Modul 1: Arbeitsblatt 3",
          status: "InProgress",
        },
      ],
    },
    {
      studentId: "s2",
      studentName: "Lisa Müller",
      email: "lisa.mueller@student.de",
      groupName: "Klasse 9A",
      worksheetsCompleted: 2,
      worksheetsTotal: 8,
      averageScore: 78,
      lastActivity: "2026-05-07",
      results: [
        {
          id: "4",
          worksheetName: "Modul 1: Arbeitsblatt 1",
          status: "Submitted",
          score: 78,
          submittedAt: "2026-04-16",
        },
        {
          id: "5",
          worksheetName: "Modul 1: Arbeitsblatt 2",
          status: "InProgress",
        },
      ],
    },
    {
      studentId: "s3",
      studentName: "Tom Weber",
      email: "tom.weber@student.de",
      groupName: "Klasse 9A",
      worksheetsCompleted: 1,
      worksheetsTotal: 8,
      averageScore: 95,
      lastActivity: "2026-05-05",
      results: [
        {
          id: "6",
          worksheetName: "Modul 1: Arbeitsblatt 1",
          status: "Submitted",
          score: 95,
          submittedAt: "2026-04-18",
        },
        {
          id: "7",
          worksheetName: "Modul 1: Arbeitsblatt 2",
          status: "Draft",
        },
      ],
    },
    {
      studentId: "s4",
      studentName: "Sarah Klein",
      email: "sarah.klein@student.de",
      groupName: "Klasse 9B",
      worksheetsCompleted: 4,
      worksheetsTotal: 8,
      averageScore: 88,
      lastActivity: "2026-05-09",
      results: [
        {
          id: "8",
          worksheetName: "Modul 1: Arbeitsblatt 1",
          status: "Submitted",
          score: 88,
          submittedAt: "2026-04-14",
        },
        {
          id: "9",
          worksheetName: "Modul 2: Arbeitsblatt 1",
          status: "Submitted",
          score: 90,
          submittedAt: "2026-04-25",
        },
      ],
    },
    {
      studentId: "s5",
      studentName: "Felix Schmidt",
      email: "felix.schmidt@student.de",
      groupName: "Klasse 9B",
      worksheetsCompleted: 0,
      worksheetsTotal: 8,
      averageScore: 0,
      lastActivity: "2026-04-10",
      results: [
        {
          id: "10",
          worksheetName: "Modul 1: Arbeitsblatt 1",
          status: "Cancelled",
        },
      ],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [expandedStudent, setExpandedStudent] = useState(null)

  const filteredStudents = students.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleStudent = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId)
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "Draft":
        return {
          label: "Entwurf",
          icon: FileText,
          color: "text-gray-500",
          bg: "bg-gray-100",
        }

      case "InProgress":
        return {
          label: "In Bearbeitung",
          icon: Clock,
          color: "text-[#00a7e7]",
          bg: "bg-[#00a7e7]/10",
        }

      case "Submitted":
        return {
          label: "Abgegeben",
          icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-50",
        }

      case "Cancelled":
        return {
          label: "Abgebrochen",
          icon: XCircle,
          color: "text-red-500",
          bg: "bg-red-50",
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

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return "bg-green-500"
    if (percentage >= 50) return "bg-[#00a7e7]"
    if (percentage >= 25) return "bg-[#c7d300]"
    return "bg-gray-400"
  }

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-[#00a7e7]"
    if (score >= 60) return "text-[#c7d300]"
    return "text-red-500"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">
          Schüler:innen & Fortschritt
        </h2>

        <p className="text-gray-600 mt-1">
          {students.length} Schüler:innen gesamt
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        <input
          type="text"
          placeholder="Nach Schüler, E-Mail oder Gruppe suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
        />
      </div>

      <div className="grid gap-4">
        {filteredStudents.map((student) => {
          const completionPercentage = Math.round(
            (student.worksheetsCompleted / student.worksheetsTotal) * 100
          )

          return (
            <div
              key={student.studentId}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#00a7e7] transition-all overflow-hidden"
            >
              <button
                onClick={() => toggleStudent(student.studentId)}
                className="w-full p-6 text-left"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-[#006ddd] rounded-full flex items-center justify-center text-white font-bold">
                      {student.studentName.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {student.studentName}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Mail className="w-4 h-4" />
                        {student.email}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Users className="w-4 h-4" />
                        {student.groupName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {student.averageScore > 0 ? (
                      <div
                        className={`text-3xl font-extrabold ${getScoreColor(
                          student.averageScore
                        )}`}
                      >
                        {student.averageScore}%
                      </div>
                    ) : (
                      <div className="text-3xl font-extrabold text-gray-400">
                        -
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                      Durchschnitt
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-gray-700">
                      Fortschritt: {student.worksheetsCompleted} /{" "}
                      {student.worksheetsTotal}
                    </span>

                    <span className="font-bold text-[#006ddd]">
                      {completionPercentage}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(
                        completionPercentage
                      )} transition-all duration-500`}
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    Letzte Aktivität:{" "}
                    {new Date(student.lastActivity).toLocaleDateString(
                      "de-DE"
                    )}
                  </p>
                </div>
              </button>

              {expandedStudent === student.studentId && (
                <div className="border-t-2 border-gray-100 bg-gray-50 p-4">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Arbeitsblatt-Ergebnisse
                  </h4>

                  <div className="grid gap-2">
                    {student.results.map((result) => {
                      const statusConfig = getStatusConfig(result.status)
                      const StatusIcon = statusConfig.icon

                      return (
                        <div
                          key={result.id}
                          className="bg-white rounded-lg p-4 flex items-center justify-between gap-4"
                        >
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 text-sm">
                              {result.worksheetName}
                            </p>

                            {result.submittedAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                Abgegeben:{" "}
                                {new Date(
                                  result.submittedAt
                                ).toLocaleDateString("de-DE")}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            {result.score !== undefined && (
                              <div
                                className={`text-xl font-extrabold ${getScoreColor(
                                  result.score
                                )}`}
                              >
                                {result.score}%
                              </div>
                            )}

                            <div
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg}`}
                            >
                              <StatusIcon
                                className={`w-4 h-4 ${statusConfig.color}`}
                              />

                              <span
                                className={`text-xs font-bold ${statusConfig.color}`}
                              >
                                {statusConfig.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {filteredStudents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Keine Schüler:innen gefunden</p>
          </div>
        )}
      </div>
    </div>
  )
}