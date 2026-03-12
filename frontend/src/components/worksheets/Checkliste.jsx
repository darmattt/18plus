import React, { useState } from "react";
import { CheckSquare, Award } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const checklistData = [
  {
    category: "Soziale Kompetenzen",
    items: [
      "Ich kann gut im Team arbeiten",
      "Ich höre anderen aktiv zu",
      "Ich kann Konflikte konstruktiv lösen",
    ],
  },
  {
    category: "Fachliche Kompetenzen",
    items: [
      "Ich arbeite sorgfältig und genau",
      "Ich kann komplexe Probleme lösen",
      "Ich lerne gerne Neues dazu",
    ],
  },
  {
    category: "Persönliche Kompetenzen",
    items: [
      "Ich bin zuverlässig und pünktlich",
      "Ich bleibe auch bei Schwierigkeiten motiviert",
      "Ich kann meine Zeit gut organisieren",
    ],
  },
  {
    category: "Kommunikation",
    items: [
      "Ich kann mich klar ausdrücken",
      "Ich gebe konstruktives Feedback",
      "Ich bin offen für Kritik",
    ],
  },
];

export default function Checkliste() {
  const totalItems = checklistData.reduce((sum, category) => sum + category.items.length, 0);

  const [checkedItems, setCheckedItems] = useState(new Array(totalItems).fill(false));
  const [showEncouragement, setShowEncouragement] = useState(false);

  const handleCheck = (globalIndex) => {
    const newChecked = [...checkedItems];
    newChecked[globalIndex] = !newChecked[globalIndex];
    setCheckedItems(newChecked);

    const checkedCountNow = newChecked.filter(Boolean).length;

    if (checkedCountNow === 6 || checkedCountNow === totalItems) {
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 3000);
    }
  };

  const checkedCount = checkedItems.filter(Boolean).length;
  const progress = (checkedCount / checkedItems.length) * 100;

  let globalIndex = 0;

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <Card className="rounded-2xl border-lime-300/30 bg-gradient-to-r from-lime-300/10 to-blue-600/10 shadow-sm">
        <CardHeader>
          <div className="mb-2 flex items-center gap-3">
            <CheckSquare className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-3xl">Arbeitsblatt: Checkliste</CardTitle>
          </div>
          <CardDescription className="text-base">
            Design-Typ: Checkliste (Fremdeinschätzung)
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="rounded-xl border shadow-sm">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">Fortschritt</span>
            <span className="text-2xl font-black text-blue-600">
              {checkedCount}/{checkedItems.length}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      <div className="relative space-y-6">
        <AnimatePresence>
          {showEncouragement && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="fixed left-1/2 top-24 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-lime-300 px-6 py-4 text-slate-900 shadow-2xl"
            >
              <Award className="h-6 w-6" />
              <span className="font-bold">
                {checkedCount === totalItems
                  ? "Perfekt! Alle Punkte bearbeitet!"
                  : "Weiter so! Du machst großartige Fortschritte!"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {checklistData.map((category, catIndex) => {
          const categoryItems = category.items.map((item) => {
            const currentGlobalIndex = globalIndex++;

            return (
              <motion.div
                key={currentGlobalIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: currentGlobalIndex * 0.05 }}
                className="group flex items-start gap-4"
              >
                <button
                  type="button"
                  onClick={() => handleCheck(currentGlobalIndex)}
                  className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border-2 transition-all ${
                    checkedItems[currentGlobalIndex]
                      ? "border-lime-500 bg-lime-500 text-white"
                      : "border-gray-300 hover:border-sky-500 group-hover:bg-gray-50"
                  }`}
                >
                  {checkedItems[currentGlobalIndex] && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  )}
                </button>

                <label
                  onClick={() => handleCheck(currentGlobalIndex)}
                  className={`cursor-pointer select-none transition-colors ${
                    checkedItems[currentGlobalIndex]
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {item}
                </label>
              </motion.div>
            );
          });

          return (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <Card className="rounded-xl border shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <h3 className="flex items-center gap-2 text-xl font-bold">
                    <div className="h-8 w-2 rounded-full bg-blue-600" />
                    {category.category}
                  </h3>

                  <div className="ml-4 space-y-3">{categoryItems}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          disabled={checkedCount < checkedItems.length}
          className="rounded-xl px-8 py-4 text-base font-bold"
        >
          {checkedCount < checkedItems.length ? (
            <>Noch {checkedItems.length - checkedCount} Punkte offen</>
          ) : (
            <>
              <CheckSquare className="mr-2 h-5 w-5" />
              Selbsteinschätzung abschließen
            </>
          )}
        </Button>
      </div>
    </div>
  );
}