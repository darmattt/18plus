import { useEffect, useState } from "react"
import { Table2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useWorksheetProgress } from "@/hooks/useWorksheetProgress"

export default function WunschlebenslaufTemplate({
  headerTitle,
  headerSubtitle,
  rowGroupLabel,
  rowLabels,
  columnLabels,
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

  const makeEmptyData = () => rowLabels.map(() => columnLabels.map(() => ""))
  const [data, setData] = useState(makeEmptyData)

  useEffect(() => {
    if (!loading) {
      setData(initialAnswers?.data ?? makeEmptyData())
    }
  }, [initialAnswers, loading, rowLabels, columnLabels])

  const updateCell = (rowIdx, colIdx, value) => {
    const next = data.map((row, rIdx) =>
      rIdx === rowIdx
        ? row.map((cell, cIdx) => (cIdx === colIdx ? value : cell))
        : row
    )
    setData(next)
    saveAnswers({ data: next })
  }

  const isComplete = data.every((row) => row.every((cell) => cell.trim().length > 0))

  const handleSubmit = async () => {
    await submitAnswers({ data })
  }

  if (loading) {
    return null
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6">
      <Card className="overflow-hidden rounded-3xl border border-blue-200/40 bg-gradient-to-r from-blue-100/40 to-sky-100/40 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Table2 className="h-7 w-7 text-blue-600" />
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

      <Card className="rounded-3xl border border-slate-200 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="w-40 px-4 py-3 text-left text-sm font-bold uppercase text-blue-700">
                    {rowGroupLabel}
                  </th>
                  {columnLabels.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-sm font-bold uppercase text-blue-700"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowLabels.map((rowLabel, rowIdx) => (
                  <tr key={rowLabel} className="border-b border-slate-100">
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">
                      {rowLabel}
                    </td>
                    {columnLabels.map((_, colIdx) => (
                      <td key={colIdx} className="px-2 py-2">
                        <Input
                          value={data[rowIdx][colIdx]}
                          onChange={(e) =>
                            updateCell(rowIdx, colIdx, e.target.value)
                          }
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
