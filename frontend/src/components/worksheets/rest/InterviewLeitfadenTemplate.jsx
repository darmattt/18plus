import { useState } from "react"
import { Mic } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

/**
 * Shablon für "Interview-Leitfaden"-Arbeitsblätter: ein Zielfeld (z.B. "zum Beruf:"),
 * gefolgt von einer festen Liste an Fragen, zu denen jeweils eine Antwort aus dem
 * Interview UND eigene Anmerkungen notiert werden.
 *
 * Props:
 * {
 *   headerTitle:     string,
 *   headerSubtitle?: string,   // Tipp-/Hinweistext
 *   targetLabel?:    string,   // z.B. "zum Beruf:" oder "zum Studium:"
 *   questions: [
 *     { question: string }
 *   ],
 *   closingText?: string,      // z.B. "Herzlichen Dank! Darf ich Sie ... kontaktieren?"
 * }
 */
export default function InterviewLeitfadenTemplate({
  headerTitle,
  headerSubtitle,
  targetLabel,
  questions,
  closingText,
}) {
  const [target, setTarget] = useState("")
  const [answers, setAnswers] = useState(() =>
    questions.map(() => ({ antwort: "", anmerkungen: "" }))
  )

  const updateAnswer = (index, field, value) => {
    const next = [...answers]
    next[index] = { ...next[index], [field]: value }
    setAnswers(next)
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 p-6">
      {/* HEADER */}
      <Card className="overflow-hidden rounded-3xl border border-blue-200/40 bg-gradient-to-r from-blue-100/40 to-sky-100/40 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Mic className="h-7 w-7 text-blue-600" />
            </div>
            <div className="flex-1">
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

      {/* TARGET FIELD */}
      {targetLabel && (
        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="flex flex-wrap items-center gap-3 p-6">
            <span className="font-semibold text-slate-900">{targetLabel}</span>
            <Input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="..."
              className="max-w-sm"
            />
          </CardContent>
        </Card>
      )}

      {/* QUESTIONS */}
      <div className="space-y-6">
        {questions.map((q, index) => (
          <Card key={index} className="rounded-3xl border border-slate-200 shadow-sm">
            <CardContent className="space-y-4 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="pt-1 text-base font-bold text-slate-900 md:text-lg">
                  {q.question}
                </h3>
              </div>

              <div className="ml-13 space-y-3 pl-0 md:pl-13">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Antwort aus dem Interview
                  </label>
                  <Textarea
                    value={answers[index].antwort}
                    onChange={(e) => updateAnswer(index, "antwort", e.target.value)}
                    rows={3}
                    placeholder="Antwort notieren..."
                    className="resize-none rounded-xl"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Meine Anmerkungen
                  </label>
                  <Textarea
                    value={answers[index].anmerkungen}
                    onChange={(e) =>
                      updateAnswer(index, "anmerkungen", e.target.value)
                    }
                    rows={2}
                    placeholder="Eigene Anmerkungen..."
                    className="resize-none rounded-xl bg-slate-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {closingText && (
        <Card className="rounded-3xl border border-sky-200 bg-sky-50">
          <CardContent className="p-6 md:p-8">
            <p className="font-bold text-slate-900">{closingText}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
