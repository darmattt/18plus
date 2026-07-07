import { useEffect, useState } from "react"
import { Users2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useWorksheetProgress } from "@/hooks/useWorksheetProgress"

export default function PartnerKreiseTemplate({
  headerTitle,
  headerSubtitle,
  centerLabel,
  circles,
  reflectionTitle = "Ueberlegen sie:",
  reflectionQuestions,
  table,
  worksheetId,
}) {
  const {
    initialAnswers,
    loading,
    saveAnswers,
    submitAnswers,
    submitted,
    submitting,
    submitError,
  } = useWorksheetProgress(worksheetId)

  const makeEmptyTableData = () =>
    table
      ? Array.from({ length: table.rowCount }).map(() =>
          table.columns.map(() => "")
        )
      : []

  const [reflectionAnswers, setReflectionAnswers] = useState(() =>
    (reflectionQuestions || []).map(() => "")
  )
  const [tableData, setTableData] = useState(makeEmptyTableData)

  useEffect(() => {
    if (!loading) {
      setReflectionAnswers(
        initialAnswers?.reflectionAnswers ?? (reflectionQuestions || []).map(() => "")
      )
      setTableData(initialAnswers?.tableData ?? makeEmptyTableData())
    }
  }, [initialAnswers, loading, reflectionQuestions])

  const persist = (nextReflectionAnswers, nextTableData) => {
    saveAnswers({
      reflectionAnswers: nextReflectionAnswers,
      tableData: nextTableData,
    })
  }

  const updateReflection = (index, value) => {
    const next = [...reflectionAnswers]
    next[index] = value
    setReflectionAnswers(next)
    persist(next, tableData)
  }

  const updateTableCell = (rowIdx, colIdx, value) => {
    const next = tableData.map((row, rIdx) =>
      rIdx === rowIdx
        ? row.map((cell, cIdx) => (cIdx === colIdx ? value : cell))
        : row
    )
    setTableData(next)
    persist(reflectionAnswers, next)
  }

  const reflectionsComplete =
    !reflectionQuestions || reflectionAnswers.every((item) => item.trim().length > 0)
  const tableComplete =
    !table || tableData.every((row) => row.every((cell) => cell.trim().length > 0))
  const isComplete = reflectionsComplete && tableComplete

  const handleSubmit = async () => {
    await submitAnswers({
      reflectionAnswers,
      tableData,
    })
  }

  if (loading) {
    return null
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 p-6">
      <Card className="overflow-hidden rounded-3xl border border-blue-200/40 bg-gradient-to-r from-blue-100/40 to-sky-100/40 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Users2 className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 md:text-3xl">
                {headerTitle}
              </CardTitle>
              <p className="mt-1 text-sm text-slate-600">{headerSubtitle}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="flex flex-wrap items-center justify-center gap-4 p-8 md:p-10">
          {centerLabel && (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-700 text-center text-sm font-bold text-white shadow-md md:h-28 md:w-28">
              {centerLabel}
            </div>
          )}
          {circles.map((label) => (
            <div
              key={label}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 px-2 text-center text-xs font-bold leading-tight text-white shadow-md md:h-28 md:w-28 md:text-sm"
            >
              {label}
            </div>
          ))}
        </CardContent>
      </Card>

      {reflectionQuestions && reflectionQuestions.length > 0 && (
        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="space-y-5 p-6 md:p-8">
            <h3 className="text-lg font-bold text-slate-900">{reflectionTitle}</h3>
            {reflectionQuestions.map((q, index) => (
              <div key={index} className="space-y-2">
                <p className="text-sm font-medium text-slate-700">{q}</p>
                <Textarea
                  value={reflectionAnswers[index]}
                  onChange={(e) => updateReflection(index, e.target.value)}
                  rows={2}
                  placeholder="Deine Antwort..."
                  className="resize-none rounded-xl"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {table && (
        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="space-y-3 p-6 md:p-8">
            {table.rowGroupLabel && (
              <h3 className="text-base font-bold text-slate-900">
                {table.rowGroupLabel}
              </h3>
            )}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[560px] border-collapse">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    {table.columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-3 text-left text-sm font-semibold text-blue-700"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: table.rowCount }).map((_, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-slate-100">
                      {table.columns.map((col, colIdx) => (
                        <td key={col.key} className="px-2 py-2">
                          <Input
                            value={tableData[rowIdx]?.[colIdx] ?? ""}
                            onChange={(e) =>
                              updateTableCell(rowIdx, colIdx, e.target.value)
                            }
                            placeholder={col.placeholder}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col items-center gap-3 pt-2">
        <Button
          size="lg"
          disabled={!isComplete || submitted || submitting}
          onClick={handleSubmit}
          className="rounded-2xl px-8 py-6 font-bold"
        >
          {!isComplete
            ? "Bitte alles ausfuellen"
            : submitting
            ? "Wird abgeschlossen..."
            : submitted
            ? "Abgeschlossen"
            : "Arbeitsblatt abschliessen"}
        </Button>

        {submitError && (
          <p className="text-center text-sm font-medium text-rose-600">
            {submitError}
          </p>
        )}
      </div>
    </div>
  )
}
