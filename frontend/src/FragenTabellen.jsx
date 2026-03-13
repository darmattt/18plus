import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileText, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const initialSkills = [
  { name: "Teamfähigkeit", level: 0 },
  { name: "Kommunikation", level: 0 },
  { name: "Selbstständigkeit", level: 0 },
  { name: "Kreativität", level: 0 },
  { name: "Analytisches Denken", level: 0 },
];

export default function FragenUndTabelle() {
  const [openAnswer, setOpenAnswer] = useState("");
  const [skills, setSkills] = useState(initialSkills);
  const [showMotivation, setShowMotivation] = useState(false);
  const [tableComplete, setTableComplete] = useState(false);

  const handleSkillChange = (index, level) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], level };
    setSkills(updated);

    const allRated = updated.every((skill) => skill.level > 0);
    if (allRated && !tableComplete) {
      setTableComplete(true);
      setShowMotivation(true);
      window.setTimeout(() => setShowMotivation(false), 3000);
    }
  };

  const isComplete = useMemo(() => {
    return openAnswer.trim().length > 30 && tableComplete;
  }, [openAnswer, tableComplete]);

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
                Arbeitsblatt: Fragen & Selbsteinschätzung
              </CardTitle>
              <p className="mt-1 text-sm text-slate-600">
                Design-Typ: Offene Fragen + Tabellen
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <AnimatePresence>
        {showMotivation && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed left-1/2 top-24 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-lime-300 px-6 py-4 text-slate-900 shadow-2xl"
          >
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">
              Ausgezeichnet! Alle Kompetenzen bewertet!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                1
              </div>

              <div className="flex-1 space-y-4">
                <h3 className="text-lg font-bold leading-7 text-slate-900 md:text-xl">
                  Reflektiere über deine bisherigen Erfahrungen: Was hast du aus
                  Praktika, Nebenjobs oder ehrenamtlichen Tätigkeiten gelernt?
                </h3>

                <Textarea
                  value={openAnswer}
                  onChange={(e) => setOpenAnswer(e.target.value)}
                  placeholder="Beschreibe deine wichtigsten Erkenntnisse und Lernerfahrungen..."
                  className="min-h-[160px] resize-none rounded-2xl border-2 border-slate-200 focus-visible:ring-sky-400"
                />

                <AnimatePresence>
                  {openAnswer.trim().length > 30 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-2 text-lime-600"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-semibold">Gut beantwortet!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="rounded-3xl border border-slate-200 shadow-sm">
          <CardContent className="p-6 md:p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-lg font-bold text-white">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 md:text-xl">
                Bewerte deine Kompetenzen auf einer Skala von 1 bis 5
              </h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[760px] border-collapse">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-4 text-left font-semibold text-slate-900">
                      Kompetenz
                    </th>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <th
                        key={level}
                        className="px-3 py-4 text-center text-sm font-semibold text-slate-600"
                      >
                        <div>{level}</div>
                        <div className="text-xs font-medium text-slate-500">
                          {level === 1
                            ? "Schwach"
                            : level === 2
                            ? "Basic"
                            : level === 3
                            ? "Gut"
                            : level === 4
                            ? "Sehr gut"
                            : "Exzellent"}
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
                      transition={{ delay: 0.2 + index * 0.08 }}
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

                      {[1, 2, 3, 4, 5].map((level) => {
                        const active = skill.level === level;

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
                        );
                      })}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
              <p className="text-sm leading-6 text-slate-700">
                <span className="font-semibold">Hinweis:</span> Sei ehrlich zu dir
                selbst. Diese Einschätzung hilft dir, deine Stärken zu erkennen
                und Bereiche zu identifizieren, in denen du dich noch
                weiterentwickeln möchtest.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-center pt-2">
        <Button
          disabled={!isComplete}
          size="lg"
          className="min-w-[320px] rounded-2xl px-8 py-6 text-base font-semibold"
        >
          {!isComplete
            ? "Bitte beide Aufgaben vollständig bearbeiten"
            : "Arbeitsblatt abschließen"}
        </Button>
      </div>
    </div>
  );
}