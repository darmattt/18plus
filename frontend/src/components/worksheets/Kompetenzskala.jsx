import { CheckCircle2, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Shablon für "Kompetenz-Skala"-Arbeitsblätter (z.B. Selbstbild, Fremdbild).
 *
 * Props:
 * {
 *   headerTitle:        string,
 *   description:        string,
 *   extraInfoText?:     string,   // optionaler fett hervorgehobener Zusatzhinweis
 *   stepNumber?:        string,   // Standard "2"
 *   scaleQuestionText:  string,
 *   scaleLabels:        string[],  // Länge = Anzahl Bewertungsstufen (hier 4)
 *   skills:             string[],
 *   columnLabel?:       string,   // Spaltenüberschrift der ersten Spalte, Standard "STÄRKEN"
 * }
 */
export default function KompetenzskalaTemplate({
  headerTitle,
  description,
  extraInfoText,
  stepNumber = "2",
  scaleQuestionText,
  scaleLabels,
  skills: initialSkillNames,
  columnLabel = "STÄRKEN",
}) {
  const [skills, setSkills] = useState(() =>
    initialSkillNames.map((name) => ({ name, level: 0 }))
  )

  const levels = scaleLabels.map((_, i) => i + 1)

  const handleSkillChange = (index, level) => {
    setSkills((prev) =>
      prev.map((skill, i) => (i === index ? { ...skill, level } : skill))
    )
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 p-6">
      <Card className="overflow-hidden rounded-3xl border border-sky-200/50 bg-gradient-to-r from-lime-100/40 via-sky-100/40 to-blue-100/40 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <FileText className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 md:text-3xl">
                {headerTitle}
              </CardTitle>
              <p className="mt-1 text-sm text-slate-600">{description}</p>
              {extraInfoText && (
                <p className="mt-1 text-sm font-bold text-blue-950">
                  {extraInfoText}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="rounded-3xl border border-slate-200 shadow-sm">
        <CardContent className="p-6 md:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-lg font-bold text-white">
              {stepNumber}
            </div>
            <h3 className="text-lg font-bold text-slate-900 md:text-xl">
              {scaleQuestionText}
            </h3>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[760px] border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-4 text-left font-semibold text-slate-900">
                    {columnLabel}
                  </th>
                  {levels.map((level) => (
                    <th
                      key={level}
                      className="px-3 py-4 text-center text-sm font-semibold text-slate-600"
                    >
                      <div>{level}</div>
                      <div className="text-xs font-medium text-slate-500">
                        {scaleLabels[level - 1]}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {skills.map((skill, index) => (
                  <motion.tr
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={skill.level > 0 ? "bg-lime-50/40" : "bg-white"}
                  >
                    <td className="border-b border-slate-100 px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{skill.name}</span>
                        {skill.level > 0 && (
                          <CheckCircle2 className="h-4 w-4 text-lime-600" />
                        )}
                      </div>
                    </td>

                    {levels.map((level) => {
                      const active = skill.level === level

                      return (
                        <td
                          key={level}
                          className="border-b border-slate-100 px-3 py-4 text-center"
                        >
                          <button
                            type="button"
                            onClick={() => handleSkillChange(index, level)}
                            className={[
                              "inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition-all",
                              active
                                ? "scale-110 border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                : "border-slate-200 bg-slate-100 text-slate-500 hover:scale-105 hover:border-sky-300 hover:bg-sky-100",
                            ].join(" ")}
                            aria-label={`${skill.name} mit ${level} bewerten`}
                          >
                            {active ? level : ""}
                          </button>
                        </td>
                      )
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}