import { useEffect, useState } from "react"
import { CheckCircle2, ListChecks } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useWorksheetProgress } from "@/hooks/useWorksheetProgress"

/**
 * Shablon für "Berufsvorschläge"-Arbeitsblätter: offene Fragen (optional mit
 * Hinweistext) gefolgt von einer persönlichen Rangordnung.
 *
 * Props:
 * {
 *   headerTitle:     string,
 *   headerSubtitle?: string,
 *
 *   openQuestions: [
 *     { hint?: string, question: string }
 *   ],
 *
 *   rankingLabel: string,
 *   rankingCount: number,
 * }
 */
export default function BerufsvorschlaegeTemplate({
  headerTitle,
  headerSubtitle,
  openQuestions,
  rankingLabel,
  rankingCount,
  worksheetId,
}) {
  const { initialAnswers, loading, saveAnswers, submitAnswers, submitted } =
    useWorksheetProgress(worksheetId)

  const [openAnswers, setOpenAnswers] = useState(() => openQuestions.map(() => ""))
  const [rankingAnswers, setRankingAnswers] = useState(() =>
    new Array(rankingCount).fill("")
  )

  useEffect(() => {
    if (!loading) {
      setOpenAnswers(initialAnswers?.openAnswers ?? openQuestions.map(() => ""))
      setRankingAnswers(initialAnswers?.rankingAnswers ?? new Array(rankingCount).fill(""))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, initialAnswers])

  const updateOpenAnswer = (index, value) => {
    const next = [...openAnswers]
    next[index] = value
    setOpenAnswers(next)
    saveAnswers({ openAnswers: next, rankingAnswers })
  }

  const updateRankingAnswer = (index, value) => {
    const next = [...rankingAnswers]
    next[index] = value
    setRankingAnswers(next)
    saveAnswers({ openAnswers, rankingAnswers: next })
  }

  const isComplete =
    openAnswers.every((answer) => answer.trim().length > 10) &&
    rankingAnswers.every((answer) => answer.trim().length > 0)

  const handleComplete = () => {
    submitAnswers({ openAnswers, rankingAnswers })
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
              <ListChecks className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 md:text-3xl">
                {headerTitle}
              </CardTitle>
              {headerSubtitle && (
                <p className="mt-1 text-sm text-slate-600">{headerSubtitle}</p>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* OPEN QUESTIONS */}
      <div className="space-y-6">
        {openQuestions.map((q, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="rounded-3xl border border-slate-200 shadow-sm">
              <CardContent className="space-y-3 p-6 md:p-8">
                {q.hint && (
                  <p className="text-sm italic text-slate-500">{q.hint}</p>
                )}
                <h3 className="text-lg font-bold text-slate-900 md:text-xl">
                  {q.question}
                </h3>
                <Textarea
                  value={openAnswers[index]}
                  onChange={(e) => updateOpenAnswer(index, e.target.value)}
                  placeholder="Deine Antwort hier eingeben..."
                  rows={4}
                  className="min-h-[110px] resize-none rounded-2xl border-slate-200 focus-visible:ring-sky-400"
                />
                {openAnswers[index].trim().length > 10 && (
                  <div className="flex items-center gap-2 text-lime-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-semibold">Beantwortet</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* RANKING */}
      <Card className="rounded-3xl border border-slate-200 shadow-sm">
        <CardContent className="space-y-4 p-6 md:p-8">
          <h3 className="text-lg font-bold text-slate-900 md:text-xl">
            {rankingLabel}
          </h3>
          <div className="space-y-3">
            {Array.from({ length: rankingCount }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <Input
                  value={rankingAnswers[index]}
                  onChange={(e) => updateRankingAnswer(index, e.target.value)}
                  placeholder="Berufsvorschlag eintragen..."
                />
              </div>
            ))}
          </div>
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
            ? "Bitte alle Felder ausfüllen"
            : submitted
            ? "Abgeschlossen"
            : "Arbeitsblatt abschließen"}
        </Button>
      </div>
    </div>
  )
}