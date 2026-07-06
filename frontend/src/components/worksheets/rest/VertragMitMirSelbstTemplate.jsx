import { useState } from "react"
import { FileSignature } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

/**
 * Shablon für "Vertrag mit mir selbst"-Arbeitsblätter: offene Fragen
 * gefolgt von Unterschriftsfeldern.
 *
 * Props:
 * {
 *   headerTitle:     string,
 *   headerSubtitle:  string,
 *   contractLabel?:  string,   // z.B. "VERTRAG MIT MIR SELBST"
 *   questions:       string[],
 *   signatureFields: string[], // z.B. ["Ort, Datum", "Unterschrift", "Unterschrift Vertragspartner/in"]
 * }
 */
export default function VertragMitMirSelbstTemplate({
  headerTitle,
  headerSubtitle,
  contractLabel,
  questions,
  signatureFields,
}) {
  const [answers, setAnswers] = useState(() => questions.map(() => ""))
  const [signatures, setSignatures] = useState(() =>
    signatureFields.map(() => "")
  )

  const updateAnswer = (index, value) => {
    const next = [...answers]
    next[index] = value
    setAnswers(next)
  }

  const updateSignature = (index, value) => {
    const next = [...signatures]
    next[index] = value
    setSignatures(next)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 p-6">
      {/* HEADER */}
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

      {/* QUESTIONS */}
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

      {/* SIGNATURES */}
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
    </div>
  )
}
