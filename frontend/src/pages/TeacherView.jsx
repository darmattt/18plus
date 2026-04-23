import React, { useEffect, useState } from "react"
import { getStudentResults, removeTeacherToken } from "@/api/teacherApi"
import { useNavigate } from "react-router-dom"

export default function TeacherView() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await getStudentResults()
        setResults(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [])

  const handleLogout = () => {
    removeTeacherToken()
    navigate("/")
  }

  if (loading) {
    return <div className="p-10">Lädt Ergebnisse...</div>
  }

  if (error) {
    return (
      <div className="p-10 space-y-4">
        <div className="text-red-600 font-bold">Fehler: {error}</div>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Teacher View</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Student Results</h2>

          {results.length === 0 ? (
            <p className="text-slate-500">Keine Ergebnisse gefunden.</p>
          ) : (
            <pre className="overflow-auto rounded-xl bg-slate-100 p-4 text-sm">
              {JSON.stringify(results, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}