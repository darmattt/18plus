import { useEffect, useState } from "react";
import { BookOpen, ChevronRight, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Ersetzt Vorkommen von link.text innerhalb von text durch einen echten <a>-Link.
 * links: [{ text: string, url: string }]
 */
function linkify(text, links) {
  if (!links || links.length === 0) return text;

  let parts = [text];

  links.forEach(({ text: linkText, url }, linkIdx) => {
    parts = parts.flatMap((part) => {
      if (typeof part !== "string") return [part];

      const split = part.split(linkText);
      if (split.length === 1) return [part];

      const result = [];
      split.forEach((chunk, idx) => {
        if (chunk) result.push(chunk);
        if (idx < split.length - 1) {
          result.push(
            <a
              key={`link-${linkIdx}-${idx}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 underline hover:text-blue-800"
            >
              {linkText}
            </a>
          );
        }
      });
      return result;
    });
  });

  return parts;
}

/**
 * Generisches Shablon für "Informationstext"-Arbeitsblätter.
 *
 * Enthält nur Layout, Animationen und Verhalten. Alle Inhalte (Titel,
 * Abschnitte, Hinweistext) kommen als Props von außen - typischerweise
 * aus einer JSON-Datei pro Arbeitsblatt.
 *
 * Erwartete Props:
 * {
 *   headerTitle:    string,
 *   headerSubtitle: string,
 *   sections: [
 *     { title: string, content: string, highlight: string,
 *       links?: [{ text: string, url: string }] }   // text-Vorkommen wird zum Link
 *   ],
 *   insightTitle: string,
 *   insightText:  string,
 *   insightLinks?: [{ text: string, url: string }],
 * }
 */
export default function InformationstextTemplate({
  headerTitle,
  headerSubtitle,
  sections,
  insightTitle,
  insightText,
  insightLinks,
}) {
  const [currentSection, setCurrentSection] = useState(0);
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    if (currentSection === sections.length - 1) {
      const timer = window.setTimeout(() => setShowInsight(true), 1000);
      return () => window.clearTimeout(timer);
    }

    setShowInsight(false);
  }, [currentSection, sections.length]);

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const currentData = sections[currentSection];
  const sentences = currentData.content.split(". ");

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 p-6">
      <Card className="overflow-hidden rounded-3xl border border-blue-200/40 bg-gradient-to-r from-blue-100/40 to-sky-100/40 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <BookOpen className="h-7 w-7 text-blue-600" />
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

      <div className="flex items-center justify-center gap-3">
        {sections.map((section, index) => {
          const active = currentSection === index;
          const visited = currentSection >= index;

          return (
            <motion.div
              key={section.title}
              initial={{ scale: 0.9 }}
              animate={{
                scale: active ? 1.2 : 1,
                backgroundColor: visited ? section.highlight : "#e5e7eb",
              }}
              className="h-3 w-3 rounded-full"
            />
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
        >
          <Card className="min-h-[420px] rounded-3xl border border-slate-200 shadow-sm">
            <CardContent className="flex min-h-[420px] flex-col p-8 md:p-10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ delay: 0.2, duration: 0.45 }}
                className="mb-6 h-1 rounded-full"
                style={{ backgroundColor: currentData.highlight }}
              />

              <motion.h3
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-6 text-2xl font-extrabold leading-tight md:text-3xl"
                style={{ color: currentData.highlight }}
              >
                {currentData.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex-1 text-lg leading-8 text-slate-700"
              >
                {sentences.map((sentence, idx) => (
                  <motion.span
                    key={`${currentSection}-${idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 + idx * 0.15 }}
                    className="inline"
                  >
                    {linkify(sentence, currentData.links)}
                    {idx < sentences.length - 1 ? ". " : ""}
                  </motion.span>
                ))}
              </motion.p>

              {currentSection < sections.length - 1 ? (
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleNext}
                    className="rounded-2xl px-6 py-6 text-base font-semibold"
                  >
                    Weiter
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              ) : (
                showInsight && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 flex items-start gap-3 rounded-2xl border border-lime-300 bg-lime-100/40 p-4"
                  >
                    <Lightbulb className="mt-1 h-6 w-6 shrink-0 text-lime-600" />
                    <div>
                      <p className="mb-1 font-semibold text-slate-900">
                        {insightTitle}
                      </p>
                      <p className="text-slate-700">
                        {linkify(insightText, insightLinks)}
                      </p>
                    </div>
                  </motion.div>
                )
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-sm text-slate-500">
        Abschnitt {currentSection + 1} von {sections.length}
      </p>
    </div>
  );
}