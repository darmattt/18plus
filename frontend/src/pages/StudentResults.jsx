import React, { useEffect, useMemo, useState } from "react"
import { Search, FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import { getStudentResults } from "@/api/teacherApi"

export default function StudentResults() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true)
        setError("")

        const data = await getStudentResults()

        const rawResults = Array.isArray(data)
            ? data
            : Array.isArray(data?.results)
                ? data.results
                : Array.isArray(data?.data)
                    ? data.data
                    : []

        const normalizedResults = rawResults.map((item, index) => ({
          id: item.id ?? index + 1,
          studentName:
              item.studentName ||
              `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
              "Unbekannt",
          groupName:
              item.groupName ||
              item.classNumber ||
              "Keine Gruppe",
          worksheetName:
              item.worksheetName ||
              item.title ||
              "Arbeitsblatt",
          status: item.status || "Draft",
          score: item.score ?? null,
          submittedAt: item.submittedAt || null,
        }))

        setResults(normalizedResults)
      } catch (err) {
        setError(err.message || "Fehler beim Laden der Ergebnisse")
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [])

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const matchesSearch =
          result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.worksheetName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter =
          filterStatus === "All" || result.status === filterStatus

      return matchesSearch && matchesFilter
    })
  }, [results, searchTerm, filterStatus])

  const getStatusConfig = (status) => {
    switch (status) {
      case "Draft":
        return {
          label: "Entwurf",
          icon: FileText,
          color: "text-gray-500",
          bg: "bg-gray-100",
          border: "border-gray-300",
        }
      case "InProgress":
        return {
          label: "In Bearbeitung",
          icon: Clock,
          color: "text-[#00a7e7]",
          bg: "bg-[#00a7e7]/10",
          border: "border-[#00a7e7]",
        }
      case "Submitted":
        return {
          label: "Abgegeben",
          icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-500",
        }
      case "Cancelled":
        return {
          label: "Abgebrochen",
          icon: XCircle,
          color: "text-red-500",
          bg: "bg-red-50",
          border: "border-red-400",
        }
      default:
        return {
          label: status || "Unbekannt",
          icon: FileText,
          color: "text-gray-500",
          bg: "bg-gray-100",
          border: "border-gray-300",
        }
    }
  }

  const statusCounts = {
    All: results.length,
    Draft: results.filter((r) => r.status === "Draft").length,
    InProgress: results.filter((r) => r.status === "InProgress").length,
    Submitted: results.filter((r) => r.status === "Submitted").length,
    Cancelled: results.filter((r) => r.status === "Cancelled").length,
  }

  if (loading) {
    return <div className="p-6">Lädt Ergebnisse...</div>
  }

  if (error) {
    return <div className="p-6 text-red-600 font-bold">Fehler: {error}</div>
  }

  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Schülerergebnisse</h2>
          <p className="text-gray-600 mt-1">{results.length} Ergebnisse gesamt</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", "Draft", "InProgress", "Submitted", "Cancelled"].map((status) => (
              <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      filterStatus === status
                          ? "bg-[#006ddd] text-white shadow-lg"
                          : "bg-white border-2 border-gray-200 text-gray-700 hover:border-[#006ddd]"
                  }`}
              >
                {status === "All" ? "Alle" : status} ({statusCounts[status]})
              </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
              type="text"
              placeholder="Nach Schüler, Gruppe oder Arbeitsblatt suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20"
          />
        </div>

        <div className="grid gap-4">
          {filteredResults.map((result) => {
            const statusConfig = getStatusConfig(result.status)
            const StatusIcon = statusConfig.icon

            return (
                <div
                    key={result.id}
                    className={`bg-white rounded-xl p-6 border-2 ${statusConfig.border}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{result.studentName}</h3>
                          <p className="text-sm text-gray-600">{result.groupName}</p>
                        </div>

                        <div className={`flex gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg}`}>
                          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                          <span className={`text-sm font-bold ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{result.worksheetName}</span>
                      </div>

                      {result.status === "Submitted" && (
                          <div className="flex gap-4 text-sm">
                            {result.score !== null && <span>{result.score}%</span>}
                            {result.submittedAt && (
                                <span>
                          {new Date(result.submittedAt).toLocaleDateString("de-DE")}
                        </span>
                            )}
                          </div>
                      )}
                    </div>
                  </div>
                </div>
            )
          })}

          {filteredResults.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Keine Ergebnisse gefunden</p>
              </div>
          )}
        </div>
      </div>
  )
}