import { useEffect, useState } from "react"
import { FileSignature } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useWorksheetProgress } from "@/hooks/useWorksheetProgress"

export default function VertragMitMirSelbstTemplate({
  headerTitle,
  headerSubtitle,
  contractLabel,
  questions,
  signatureFields,
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

  const [answers, setAnswers] = useState(() => questions.map(() => ""))
  const [signatures, setSignatures] = useState(() => signatureFields.map(() => ""))

  useEffect(() => {
    if (!loading) {
      setAnswers(initialAnswers?.answers ?? questions.map(() => ""))
      setSignatures(initialAnswers?.signatures ?? signatureFields.map(() => ""))
    }
  }, [initialAnswers, loading, questions, signatureFields])

  const persist = (nextAnswers, nextSignatures) => {
    saveAnswers({
      answers: nextAnswers,
      signatures: nextSignatures,
    })
  }

  const updateAnswer = (index, value) => {
    const next = [...answers]
    next[index] = value
    setAnswers(next)
    persist(next, signatures)
  }

  const updateSignature = (index, value) => {
    const next = [...signatures]
    next[index] = value
    setSignatures(next)
    persist(answers, next)
  }

  const isComplete =
    answers.every((item) => item.trim().length > 0) &&
    signatures.every((item) => item.trim().length > 0)

  const handleSubmit = async () => {
    await submitAnswers({
      answers,
      signatures,
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
              <FileSignature className="h-7 w-7 text-blue-600" />
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

      {contractLabel && (
        <div className="rounded-2xl bg-slate-900 px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-white">
          {contractLabel}
        </div>
      )}

      <div className="space-y-5">
        {questions.map((question, index) => (
          <Card key={index} className="rounded-3xl border border-slate-200 shadow-sm">
            <CardContent className="space-y-3 p-6 md:p-8">
              <h3 className="text-base font-bold text-slate-900 md:text-lg">
                {question}
              </h3>
              <Textarea
                value={answers[index]}
                onChange={(e) => updateAnswer(index, e.target.value)}
                rows={2}
                placeholder="Deine Antwort..."
                className="resize-none rounded-xl"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border border-slate-200 shadow-sm">
        <CardContent className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
          {signatureFields.map((label, index) => (
            <div key={index} className="space-y-2">
              <Input
                value={signatures[index]}
                onChange={(e) => updateSignature(index, e.target.value)}
              />
              <p className="text-center text-xs font-medium text-slate-500">
                {label}
              </p>
            </div>
          ))}
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
