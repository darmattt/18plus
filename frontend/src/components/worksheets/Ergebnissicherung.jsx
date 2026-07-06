import { useEffect, useState } from "react"
import { ClipboardList } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useWorksheetProgress } from "@/hooks/useWorksheetProgress"

/**
 * Shablon für "Ergebnissicherung"-Arbeitsblätter: eine Reflexionsfrage
 * gefolgt von einem Ausbildungs-Vergleichsraster (feste Zeilen x Varianten-Spalten).
 *
 * Props:
 * {
 *   headerTitle:    string,
 *
 *   reflectionQuestion: string,
 *
 *   comparisonIntroLabel?: string,  // z.B. "Recherche"
 *   comparisonIntroText:   string,
 *   comparisonVariants:    string[],   // z.B. ["Variante A", "Variante B", "Variante C"]
 *   comparisonRowLabels:   string[],   // z.B. ["Name der Ausbildung", "Institution", ...]
 *   comparisonSections: [
 *     { title: string }   // z.B. { title: "Meine Nummer 1" }, { title: "Ev. auch Nummer 2" }
 *   ],
 * }
 */
export default function ErgebnissicherungTemplate({
  headerTitle,
  reflectionQuestion,
  comparisonIntroLabel = "Recherche",
  comparisonIntroText,
  comparisonVariants,
  comparisonRowLabels,
  comparisonSections,
  worksheetId,
}) {
  const { initialAnswers, loading, saveAnswers, submitAnswers, submitted } =
    useWorksheetProgress(worksheetId)

  const makeEmptyComparisonData = () =>
    comparisonSections.map(() =>
      comparisonRowLabels.map(() => comparisonVariants.map(() => ""))
    )

  const [reflectionAnswer, setReflectionAnswer] = useState("")
  const [comparisonData, setComparisonData] = useState(makeEmptyComparisonData)

  useEffect(() => {
    if (!loading) {
      setReflectionAnswer(initialAnswers?.reflectionAnswer ?? "")
      setComparisonData(initialAnswers?.comparisonData ?? makeEmptyComparisonData())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, initialAnswers])

  const handleReflectionChange = (value) => {
    setReflectionAnswer(value)
    saveAnswers({ reflectionAnswer: value, comparisonData })
  }

  const updateComparisonCell = (sectionIdx, rowIdx, colIdx, value) => {
    const next = comparisonData.map((section, sIdx) =>
      sIdx === sectionIdx
        ? section.map((row, rIdx) =>
            rIdx === rowIdx
              ? row.map((cell, cIdx) => (cIdx === colIdx ? value : cell))
              : row
          )
        : section
    )
    setComparisonData(next)
    saveAnswers({ reflectionAnswer, comparisonData: next })
  }

  const isComplete = reflectionAnswer.trim().length > 0

  const handleComplete = () => {
    submitAnswers({ reflectionAnswer, comparisonData })
  }

  if (loading) {
    return null
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4 md:gap-8 md:p-6">
      {/* HEADER */}
      <Card className="overflow-hidden rounded-3xl border border-blue-200/40 bg-gradient-to-r from-blue-100/40 to-sky-100/40 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <ClipboardList className="h-7 w-7 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 md:text-3xl">
              {headerTitle}
            </CardTitle>
          </div>
        </CardHeader>
      </Card>

      {/* REFLECTION QUESTION */}
      <Card className="rounded-3xl border border-slate-200 shadow-sm">
        <CardContent className="space-y-3 p-6 md:p-8">
          <h3 className="text-lg font-bold text-slate-900 md:text-xl">
            {reflectionQuestion}
          </h3>
          <Textarea
            value={reflectionAnswer}
            onChange={(e) => handleReflectionChange(e.target.value)}
            placeholder="Deine Gedanken schlagwortartig..."
            rows={4}
            className="min-h-[110px] resize-none rounded-2xl border-slate-200 focus-visible:ring-sky-400"
          />
        </CardContent>
      </Card>

      {/* COMPARISON GRID */}
      <Card className="rounded-3xl border border-slate-200 shadow-sm">
        <CardContent className="space-y-8 p-6 md:p-8">
          <div>
            <span className="font-semibold text-slate-900">{comparisonIntroLabel}</span>{" "}
            <span className="text-slate-700">{comparisonIntroText}</span>
          </div>

          {comparisonSections.map((section, sectionIdx) => (
            <div key={section.title} className="space-y-3">
              <div className="rounded-lg bg-sky-50 px-4 py-2 font-bold text-slate-900">
                {section.title}
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200">
                      <th className="w-40 px-4 py-3 text-left text-sm font-semibold text-slate-500" />
                      {comparisonVariants.map((variant) => (
                        <th
                          key={variant}
                          className="px-4 py-3 text-center text-sm font-bold uppercase text-slate-700"
                        >
                          {variant}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRowLabels.map((rowLabel, rowIdx) => (
                      <tr key={rowLabel} className="border-b border-slate-100">
                        <td className="px-4 py-3 align-top text-sm font-medium text-slate-700">
                          {rowLabel}
                        </td>
                        {comparisonVariants.map((_, colIdx) => (
                          <td key={colIdx} className="px-2 py-2">
                            <Input
                              value={comparisonData[sectionIdx][rowIdx][colIdx]}
                              onChange={(e) =>
                                updateComparisonCell(
                                  sectionIdx,
                                  rowIdx,
                                  colIdx,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-center pt-2">
        <Button
          size="lg"
          disabled={!isComplete || submitted}
          onClick={handleComplete}
          className="rounded-2xl bg-gradient-to-r from-[#006dd6] to-[#c7d300] px-8 py-6 text-base font-bold text-white hover:brightness-110"
        >
          {!isComplete
            ? "Bitte Reflexionsfrage beantworten"
            : submitted
            ? "Abgeschlossen"
            : "Arbeitsblatt abschließen"}
        </Button>
      </div>
    </div>
  )
}