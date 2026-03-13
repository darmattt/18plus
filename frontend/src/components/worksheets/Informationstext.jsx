
import { Link } from "react-router-dom"

import React, { useEffect, useState } from "react";
import { BookOpen, ChevronRight, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Berufsorientierung: Der erste Schritt",
    content:
      "Die Wahl des richtigen Berufs ist eine der wichtigsten Entscheidungen im Leben. Es geht nicht nur darum, Geld zu verdienen, sondern auch darum, eine Tätigkeit zu finden, die zu deinen Interessen, Fähigkeiten und Werten passt.",
    highlight: "#006ddd",
  },
  {
    title: "Selbstreflexion ist der Schlüssel",
    content:
      "Bevor du dich für einen Beruf entscheidest, solltest du dir Zeit nehmen, über dich selbst nachzudenken. Was sind deine Stärken? Was macht dir Freude? Welche Themen interessieren dich? Diese Fragen helfen dir, den richtigen Weg zu finden.",
    highlight: "#00a7e7",
  },
  {
    title: "Praktische Erfahrungen sammeln",
    content:
      "Praktika, Schnuppertage und Gespräche mit Berufstätigen sind unerlässlich. Nur durch praktische Erfahrungen kannst du herausfinden, ob ein Beruf wirklich zu dir passt. Nutze jede Gelegenheit, verschiedene Berufsfelder kennenzulernen!",
    highlight: "#c7d300",
  },
  {
    title: "Der Weg ist das Ziel",
    content:
      "Denke daran: Deine berufliche Laufbahn ist kein gerader Weg, sondern eine Reise. Es ist völlig normal, seine Meinung zu ändern und neue Richtungen einzuschlagen. Bleib offen für neue Möglichkeiten und hab keine Angst vor Veränderungen!",
    highlight: "#006ddd",
  },
];

export default function TextArbeitsblatt() {
  const [currentSection, setCurrentSection] = useState(0);
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    if (currentSection === sections.length - 1) {
      const timer = window.setTimeout(() => setShowInsight(true), 1000);
      return () => window.clearTimeout(timer);
    }

    setShowInsight(false);
  }, [currentSection]);

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
                Arbeitsblatt: Informationstext
              </CardTitle>
              <p className="mt-1 text-sm text-slate-600">Design-Typ: Text</p>
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
                    {sentence}
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
                        Wichtiger Hinweis:
                      </p>
                      <p className="text-slate-700">
                        Nutze die Erkenntnisse aus diesem Text für deine weiteren
                        Arbeitsblätter. Deine Berufswahl sollte gut überlegt sein!
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