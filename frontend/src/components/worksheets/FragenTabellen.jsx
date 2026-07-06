import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileText, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useWorksheetProgress } from "@/hooks/useWorksheetProgress";

const defaultScaleLabels = ["Schwach", "Basic", "Gut", "Sehr gut", "Exzellent"];

/**
 * Shablon für "Offene Frage + Kompetenz-Tabelle"-Arbeitsblätter.
 *
 * Props:
 * {
 *   headerTitle:       string,
 *   headerSubtitle:    string,
 *   openQuestionText:  string,
 *   openAnswerMinLength?: number,
 *   skills:            string[],
 *   scaleLabels?:      string[],   // Länge = Anzahl der Bewertungsstufen (Standard 5)
 *   motivationText?:   string,
 *   hintTitle?:        string,
 *   hintText?:         string,
 *   submitLabelIncomplete?: string,
 *   submitLabelComplete?:   string,
 *   columnLabel?:      string,   // Spaltenüberschrift der ersten Spalte, Standard "Kompetenz"
 *   openAnswerPlaceholder?: string,
 *   tableHeadingText?: string,   // Standard "Bewerte deine Kompetenzen auf einer Skala von 1 bis N"
 * }
 */
export default function FragenTabellenTemplate({
  headerTitle,
  headerSubtitle,
  openQuestionText,
  openAnswerMinLength = 30,
  skills: initialSkillNames,
  scaleLabels = defaultScaleLabels,
  motivationText = "Ausgezeichnet! Alle Kompetenzen bewertet!",
  hintTitle = "Hinweis:",
  hintText = "Sei ehrlich zu dir selbst. Diese Einschätzung hilft dir, deine Stärken zu erkennen und Bereiche zu identifizieren, in denen du dich noch weiterentwickeln möchtest.",
  submitLabelIncomplete = "Bitte beide Aufgaben vollständig bearbeiten",
  submitLabelComplete = "Arbeitsblatt abschließen",
  columnLabel = "Kompetenz",
  openAnswerPlaceholder = "Beschreibe deine wichtigsten Erkenntnisse und Lernerfahrungen...",
  tableHeadingText,
  worksheetId,
}) {
  const levels = scaleLabels.map((_, i) => i + 1);

  const { initialAnswers, loading, saveAnswers, submitAnswers, submitted } =
    useWorksheetProgress(worksheetId);

  const [openAnswer, setOpenAnswer] = useState("");
  const [skills, setSkills] = useState(() =>
    initialSkillNames.map((name) => ({ name, level: 0 }))
  );
  const [showMotivation, setShowMotivation] = useState(false);
  const [tableComplete, setTableComplete] = useState(false);

  useEffect(() => {
    if (!loading) {
      const restoredSkills =
        initialAnswers?.skills ?? initialSkillNames.map((name) => ({ name, level: 0 }));
      setOpenAnswer(initialAnswers?.openAnswer ?? "");
      setSkills(restoredSkills);
      setTableComplete(restoredSkills.every((skill) => skill.level > 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, initialAnswers]);

  const handleOpenAnswerChange = (value) => {
    setOpenAnswer(value);
    saveAnswers({ openAnswer: value, skills });
  };

  const handleSkillChange = (index, level) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], level };
    setSkills(updated);
    saveAnswers({ openAnswer, skills: updated });

    const allRated = updated.every((skill) => skill.level > 0);
    if (allRated && !tableComplete) {
      setTableComplete(true);
      setShowMotivation(true);
      window.setTimeout(() => setShowMotivation(false), 3000);
    }
  };

  const isComplete = useMemo(() => {
    return openAnswer.trim().length > openAnswerMinLength && tableComplete;
  }, [openAnswer, tableComplete, openAnswerMinLength]);

  const handleComplete = () => {
    submitAnswers({ openAnswer, skills });
  };

  if (loading) {
    return null;
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4 md:gap-8 md:p-6">
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
              <p className="mt-1 text-sm text-slate-600">{headerSubtitle}</p>
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
            <span className="font-semibold">{motivationText}</span>
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
                  {openQuestionText}
                </h3>

                <Textarea
                  value={openAnswer}
                  onChange={(e) => handleOpenAnswerChange(e.target.value)}
                  placeholder={openAnswerPlaceholder}
                  className="min-h-[160px] resize-none rounded-2xl border-2 border-slate-200 focus-visible:ring-sky-400"
                />

                <AnimatePresence>
                  {openAnswer.trim().length > openAnswerMinLength && (
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
                {tableHeadingText ??
                  `Bewerte deine Kompetenzen auf einer Skala von 1 bis ${levels.length}`}
              </h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full border-collapse">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-2 py-3 text-left font-semibold text-slate-900 sm:px-4 sm:py-4">
                      {columnLabel}
                    </th>
                    {levels.map((level) => (
                      <th
                        key={level}
                        className="px-1 py-3 text-center text-sm font-semibold text-slate-600 sm:px-3 sm:py-4"
                      >
                        <div>{level}</div>
                        <div className="hidden text-xs font-medium text-slate-500 sm:block">
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
                      transition={{ delay: 0.2 + index * 0.08 }}
                      className={skill.level > 0 ? "bg-lime-50/40" : "bg-white"}
                    >
                      <td className="border-b border-slate-100 px-2 py-3 sm:px-4 sm:py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900 sm:text-base">
                            {skill.name}
                          </span>
                          {skill.level > 0 && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-lime-600" />
                          )}
                        </div>
                      </td>

                      {levels.map((level) => {
                        const active = skill.level === level;

                        return (
                          <td
                            key={level}
                            className="border-b border-slate-100 px-1 py-3 text-center sm:px-3 sm:py-4"
                          >
                            <button
                              type="button"
                              onClick={() => handleSkillChange(index, level)}
                              className={[
                                "inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition-all sm:h-9 sm:w-9 sm:text-sm",
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
                <span className="font-semibold">{hintTitle}</span> {hintText}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-center pt-2">
        <Button
          disabled={!isComplete || submitted}
          onClick={handleComplete}
          size="lg"
          className="min-w-[320px] rounded-2xl bg-gradient-to-r from-[#006dd6] to-[#c7d300] px-8 py-6 text-base font-semibold text-white hover:brightness-110"
        >
          {!isComplete ? submitLabelIncomplete : submitted ? "Abgeschlossen" : submitLabelComplete}
        </Button>
      </div>
    </div>
  );
}