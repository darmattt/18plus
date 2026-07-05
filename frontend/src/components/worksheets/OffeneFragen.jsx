import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

/**
 * Shablon für "Offene Fragen"-Arbeitsblätter.
 *
 * Props:
 * {
 *   headerTitle:         string,
 *   headerSubtitle:      string,
 *   questions:           string[],
 *   motivationMessages:  string[],  // gleiche Länge wie questions
 *   completeLabel?:      string,
 * }
 */
export default function OffeneFragenTemplate({
  headerTitle,
  headerSubtitle,
  questions,
  motivationMessages,
  completeLabel = "Arbeitsblatt abschließen",
}) {
  const [answers, setAnswers] = useState(() => questions.map(() => ""));
  const [showMotivation, setShowMotivation] = useState(null);
  const [completed, setCompleted] = useState([]);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);

    if (value.trim().length > 20 && !completed.includes(index)) {
      setCompleted((prev) => [...prev, index]);
      setShowMotivation(index);
      setTimeout(() => setShowMotivation(null), 3000);
    }

    if (value.trim().length <= 20 && completed.includes(index)) {
      setCompleted((prev) => prev.filter((item) => item !== index));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <Card className="overflow-hidden rounded-3xl border border-sky-200 bg-sky-50 shadow-sm">
          <CardHeader className="space-y-2 px-5 py-5 md:px-8 md:py-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {headerTitle}
            </h1>
            <p className="text-sm text-slate-600 md:text-base">{headerSubtitle}</p>
          </CardHeader>
        </Card>

        <div className="space-y-5">
          {questions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              className="relative"
            >
              <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:border-sky-200">
                <CardContent className="px-5 py-5 md:px-8 md:py-7">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-400 text-sm font-bold text-slate-900">
                      {index + 1}
                    </div>

                    <div className="flex-1 space-y-4">
                      <label className="block text-base font-semibold text-slate-900 md:text-xl">
                        {question}
                      </label>

                      <Textarea
                        value={answers[index]}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder="Deine Antwort hier eingeben..."
                        rows={5}
                        className="min-h-[120px] resize-none rounded-2xl border-slate-200 bg-white px-4 py-3 text-base shadow-none focus-visible:ring-2 focus-visible:ring-sky-400"
                      />

                      {completed.includes(index) && (
                        <div className="flex items-center gap-2 text-lime-600">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="text-sm font-semibold">Beantwortet</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <AnimatePresence>
                {showMotivation === index && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 4 }}
                    className="absolute right-3 top-0 z-10 md:right-6"
                  >
                    <Badge className="rounded-full bg-lime-400 px-4 py-2 text-sm text-slate-900 hover:bg-lime-400">
                      <Sparkles className="mr-2 h-4 w-4" />
                      {motivationMessages[index]}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <Button
            size="lg"
            disabled={completed.length < questions.length}
            className="rounded-2xl px-8 py-6 text-base font-bold"
          >
            {completed.length < questions.length
              ? `Noch ${questions.length - completed.length} Fragen offen`
              : completeLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}