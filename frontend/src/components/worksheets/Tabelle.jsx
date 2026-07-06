import { useEffect, useState } from "react"
import { Table, Plus, Trash2, Sparkles, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useWorksheetProgress } from "@/hooks/useWorksheetProgress"

/**
 * Shablon für "Tabelle"-Vergleichs-Arbeitsblätter.
 *
 * Props:
 * {
 *   headerTitle:    string,
 *   headerSubtitle: string,
 *   columns: [
 *     { key: string, label: string, placeholder: string,
 *       minLength: number, multiline?: boolean }
 *   ],
 *   addButtonLabel?:       string,
 *   tipTitle?:             string,
 *   tipText?:              string,
 *   celebrationText?:      string,
 *   progressLabel?:        string,
 *   submitLabelIncomplete?: string,
 *   submitLabelComplete?:  string,
 * }
 *
 * Der erste Column-Eintrag wird als "Haupt"-Spalte behandelt (Input + Checkmark),
 * alle weiteren werden als Textarea gerendert.
 */
export default function TabelleTemplate({
  headerTitle,
  headerSubtitle,
  columns,
  addButtonLabel = "Zeile hinzufügen",
  tipTitle = "Tipp zum Ausfüllen",
  tipText = "Recherchiere gründlich. Je detaillierter deine Angaben, desto besser kannst du die Optionen miteinander vergleichen!",
  celebrationText = "Hervorragend! Alle Zeilen analysiert!",
  progressLabel = "Zeilen analysiert",
  submitLabelIncomplete = "Mindestens eine Zeile vollständig ausfüllen",
  submitLabelComplete = "Analyse abschließen",
  worksheetId,
}) {
  const makeEmptyRow = () => {
    const row = { id: Date.now() + Math.random() }
    columns.forEach((col) => {
      row[col.key] = ""
    })
    return row
  }

  const { initialAnswers, loading, saveAnswers, submitAnswers, submitted } =
    useWorksheetProgress(worksheetId)

  const [rows, setRows] = useState([makeEmptyRow()])
  const [showTip, setShowTip] = useState(false)
  const [highlightedRow, setHighlightedRow] = useState(null)

  useEffect(() => {
    if (!loading) {
      setRows(initialAnswers?.rows ?? [makeEmptyRow()])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, initialAnswers])

  const addRow = () => {
    const next = [...rows, makeEmptyRow()]
    setRows(next)
    saveAnswers({ rows: next })
  }

  const removeRow = (id) => {
    if (rows.length > 1) {
      const next = rows.filter((row) => row.id !== id)
      setRows(next)
      saveAnswers({ rows: next })
    }
  }

  const isRowComplete = (row) => {
    return columns.every((col) => row[col.key].length > col.minLength)
  }

  const updateCell = (id, key, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [key]: value } : row
    )

    setRows(updatedRows)
    saveAnswers({ rows: updatedRows })

    const currentRow = updatedRows.find((r) => r.id === id)

    if (currentRow && isRowComplete(currentRow)) {
      setHighlightedRow(id)
      setTimeout(() => setHighlightedRow(null), 2000)

      if (updatedRows.every(isRowComplete)) {
        setShowTip(true)
        setTimeout(() => setShowTip(false), 3500)
      }
    }
  }

  const completedRows = rows.filter(isRowComplete).length
  const [mainColumn, ...restColumns] = columns

  const handleComplete = () => {
    submitAnswers({ rows })
  }

  if (loading) {
    return null
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 md:space-y-8 md:px-6 md:py-10">
      {/* HEADER */}
      <Card className="rounded-3xl border border-sky-200 bg-sky-50 shadow-sm">
        <CardHeader className="flex items-center gap-3 px-8 py-6">
          <Table className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{headerTitle}</h1>
            <p className="text-slate-600">{headerSubtitle}</p>
          </div>
        </CardHeader>
      </Card>

      {/* PROGRESS */}
      <Card className="rounded-3xl border border-slate-200 shadow-sm">
        <CardContent className="flex items-center justify-between px-8 py-6">
          <span className="font-semibold text-slate-600">{progressLabel}</span>

          <div className="flex items-center gap-4">
            <div className="text-3xl font-black text-blue-600">
              {completedRows}/{rows.length}
            </div>

            <Button onClick={addRow} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {addButtonLabel}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <div className="relative">
        <AnimatePresence>
          {showTip && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 bg-lime-400 text-slate-900 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              <span className="font-bold">{celebrationText}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE: stacked cards, avoids horizontal scrolling with several text columns */}
        <div className="space-y-4 sm:hidden">
          {rows.map((row) => (
            <div
              key={row.id}
              className={`rounded-2xl border p-4 space-y-3 transition-all ${
                highlightedRow === row.id
                  ? "border-lime-300 bg-lime-200/30"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Input
                  value={row[mainColumn.key]}
                  onChange={(e) => updateCell(row.id, mainColumn.key, e.target.value)}
                  placeholder={mainColumn.placeholder}
                  className="flex-1"
                />
                {isRowComplete(row) && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-lime-400" />
                )}
                {rows.length > 1 && (
                  <button
                    onClick={() => removeRow(row.id)}
                    className="shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>

              {restColumns.map((col) => (
                <div key={col.key}>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">
                    {col.label}
                  </label>
                  <Textarea
                    rows={2}
                    value={row[col.key]}
                    onChange={(e) => updateCell(row.id, col.key, e.target.value)}
                    placeholder={col.placeholder}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* DESKTOP/TABLET: full table */}
        <div className="hidden rounded-3xl border border-slate-200 shadow-sm overflow-hidden sm:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-sky-500 text-white">
                  <th className="px-6 py-4 text-left w-48">{mainColumn.label}</th>
                  {restColumns.map((col) => (
                    <th key={col.key} className="px-6 py-4 text-left">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-center w-24">Aktion</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b border-slate-100 transition-all ${
                      highlightedRow === row.id
                        ? "bg-lime-200/30"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Input
                          value={row[mainColumn.key]}
                          onChange={(e) =>
                            updateCell(row.id, mainColumn.key, e.target.value)
                          }
                          placeholder={mainColumn.placeholder}
                        />
                        {isRowComplete(row) && (
                          <CheckCircle2 className="h-5 w-5 text-lime-400" />
                        )}
                      </div>
                    </td>

                    {restColumns.map((col) => (
                      <td key={col.key} className="px-6 py-4">
                        <Textarea
                          rows={2}
                          value={row[col.key]}
                          onChange={(e) =>
                            updateCell(row.id, col.key, e.target.value)
                          }
                          placeholder={col.placeholder}
                        />
                      </td>
                    ))}

                    <td className="px-6 py-4 text-center">
                      {rows.length > 1 && (
                        <button
                          onClick={() => removeRow(row.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* INFO BOX */}
      <Card className="rounded-3xl border border-sky-200 bg-sky-50">
        <CardContent className="flex items-start gap-3 px-8 py-6">
          <Sparkles className="h-6 w-6 text-sky-500 mt-1" />
          <div>
            <p className="font-bold text-slate-900 mb-1">{tipTitle}</p>
            <p className="text-sm text-slate-700">{tipText}</p>
          </div>
        </CardContent>
      </Card>

      {/* SUBMIT */}
      <div className="flex justify-center pt-4">
        <Button
          disabled={completedRows < 1 || submitted}
          onClick={handleComplete}
          className="rounded-2xl bg-gradient-to-r from-[#006dd6] to-[#c7d300] px-8 py-6 font-bold text-white hover:brightness-110"
        >
          {completedRows < 1 ? submitLabelIncomplete : submitted ? "Abgeschlossen" : submitLabelComplete}
        </Button>
      </div>
    </div>
  )
}