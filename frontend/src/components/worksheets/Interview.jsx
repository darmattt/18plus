import { useEffect, useState } from "react"
import { Users, MessageSquare, Sparkles, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useWorksheetProgress } from "@/hooks/useWorksheetProgress"

/**
 * Shablon für "Interview"-Arbeitsblätter.
 *
 * Props:
 * {
 *   headerTitle:    string,
 *   headerSubtitle: string,
 *   questions:      string[],
 *   tips:           string[],   // gleiche Länge wie questions
 *   submitLabel?:   string,
 * }
 */
export default function InterviewTemplate({
  headerTitle,
  headerSubtitle,
  questions,
  tips,
  submitLabel = "Arbeitsblatt einreichen",
  worksheetId,
}) {
  const { initialAnswers, loading, saveAnswers, submitAnswers, submitted } =
    useWorksheetProgress(worksheetId)

  const [interviews, setInterviews] = useState(() =>
    questions.map(() => ({ person: "", notes: "", completed: false }))
  )
  const [showTip, setShowTip] = useState(null)

  useEffect(() => {
    if (!loading) {
      setInterviews(
        initialAnswers?.interviews ??
          questions.map(() => ({ person: "", notes: "", completed: false }))
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, initialAnswers])

  const updateCompleted = (newInterviews, index) => {
    newInterviews[index].completed =
      newInterviews[index].person.length > 2 && newInterviews[index].notes.length > 20
    return newInterviews
  }

  const handlePersonChange = (index, value) => {
    const newInterviews = [...interviews]
    newInterviews[index].person = value
    const updated = updateCompleted(newInterviews, index)
    setInterviews(updated)
    saveAnswers({ interviews: updated })
  }

  const handleNotesChange = (index, value) => {
    const newInterviews = [...interviews]
    newInterviews[index].notes = value
    const updated = updateCompleted(newInterviews, index)
    setInterviews(updated)
    saveAnswers({ interviews: updated })

    if (value.length > 30 && !updated[index].completed) {
      setShowTip(index)
      setTimeout(() => setShowTip(null), 3500)
    }
  }

  const handleComplete = () => {
    submitAnswers({ interviews })
  }

  if (loading) {
    return null
  }

  const completedCount = interviews.filter((i) => i.completed).length

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-6 md:space-y-8 md:px-6 md:py-10">
      {/* HEADER */}
      <Card className="rounded-3xl border border-sky-200 bg-sky-50 shadow-sm">
        <CardHeader className="flex items-center gap-3 px-8 py-6">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{headerTitle}</h1>
            <p className="text-slate-600">{headerSubtitle}</p>
          </div>
        </CardHeader>
      </Card>

      {/* QUESTIONS */}
      <div className="space-y-6">
        {questions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="relative"
          >
            <Card className="rounded-3xl border border-slate-200 shadow-sm">
              <CardContent className="px-8 py-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white font-bold">
                    {index + 1}
                  </div>

                  <p className="flex-1 text-lg font-semibold text-slate-900">
                    {question}
                  </p>

                  {interviews[index].completed && (
                    <CheckCircle2 className="h-6 w-6 text-lime-400" />
                  )}
                </div>

                {/* INPUTS */}
                <div className="grid md:grid-cols-2 gap-5 ml-14">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Users className="h-4 w-4 text-blue-600" />
                      Befragte Person
                    </label>

                    <Input
                      value={interviews[index].person}
                      onChange={(e) => handlePersonChange(index, e.target.value)}
                      placeholder="Name oder Berufsbezeichnung"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      Antworten & Notizen
                    </label>

                    <Textarea
                      rows={3}
                      value={interviews[index].notes}
                      onChange={(e) => handleNotesChange(index, e.target.value)}
                      placeholder="Notiere hier die Antworten..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* TIP */}
            <AnimatePresence>
              {showTip === index && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute -top-4 right-6 bg-lime-400 text-slate-900 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-bold">{tips[index]}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* FOOTER */}
      <Card className="rounded-3xl border border-slate-200 shadow-sm">
        <CardContent className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-black text-blue-600">
              {completedCount}/{questions.length}
            </div>
            <span className="text-slate-600">Interviews abgeschlossen</span>
          </div>

          <Button
            disabled={completedCount < questions.length || submitted}
            onClick={handleComplete}
            className="rounded-2xl bg-gradient-to-r from-[#006dd6] to-[#c7d300] px-8 py-6 text-base font-bold text-white hover:brightness-110"
          >
            {submitted ? "Abgeschlossen" : submitLabel}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}