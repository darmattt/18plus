import { useEffect, useState } from "react";
import { CheckSquare, Award } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWorksheetProgress } from "@/hooks/useWorksheetProgress";

/**
 * Shablon für "Checkliste"-Arbeitsblätter.
 *
 * Props:
 * {
 *   headerTitle:      string,
 *   headerSubtitle:   string,
 *   checklistData: [
 *     { category: string, items: string[] }
 *   ],
 *   encouragementMidText?:      string,  // Zwischenmeldung, z.B. nach der Hälfte
 *   encouragementCompleteText?: string,
 *   completeButtonLabel?:       string,
 * }
 */
export default function ChecklisteTemplate({
  headerTitle,
  headerSubtitle,
  checklistData,
  encouragementMidText = "Weiter so! Du machst großartige Fortschritte!",
  encouragementCompleteText = "Perfekt! Alle Punkte bearbeitet!",
  completeButtonLabel = "Selbsteinschätzung abschließen",
  worksheetId,
}) {
  const totalItems = checklistData.reduce(
    (sum, category) => sum + category.items.length,
    0
  );
  const midPoint = Math.round(totalItems / 2);

  const { initialAnswers, loading, saveAnswers, submitAnswers, submitted } =
    useWorksheetProgress(worksheetId);

  const [checkedItems, setCheckedItems] = useState(new Array(totalItems).fill(false));
  const [showEncouragement, setShowEncouragement] = useState(false);

  useEffect(() => {
    if (!loading) {
      setCheckedItems(initialAnswers?.checkedItems ?? new Array(totalItems).fill(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, initialAnswers]);

  const handleCheck = (globalIndex) => {
    const newChecked = [...checkedItems];
    newChecked[globalIndex] = !newChecked[globalIndex];
    setCheckedItems(newChecked);
    saveAnswers({ checkedItems: newChecked });

    const checkedCountNow = newChecked.filter(Boolean).length;

    if (checkedCountNow === midPoint || checkedCountNow === totalItems) {
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 3000);
    }
  };

  const handleComplete = () => {
    submitAnswers({ checkedItems });
  };

  if (loading) {
    return null;
  }

  const checkedCount = checkedItems.filter(Boolean).length;
  const progress = (checkedCount / checkedItems.length) * 100;

  let globalIndex = 0;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 md:space-y-8 md:p-6">
      <Card className="rounded-2xl border-lime-300/30 bg-gradient-to-r from-lime-300/10 to-blue-600/10 shadow-sm">
        <CardHeader>
          <div className="mb-2 flex items-center gap-3">
            <CheckSquare className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-3xl">{headerTitle}</CardTitle>
          </div>
          <CardDescription className="text-base">{headerSubtitle}</CardDescription>
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
                  ? encouragementCompleteText
                  : encouragementMidText}
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
          disabled={checkedCount < checkedItems.length || submitted}
          onClick={handleComplete}
          className="rounded-xl bg-gradient-to-r from-[#006dd6] to-[#c7d300] px-8 py-4 text-base font-bold text-white hover:brightness-110"
        >
          {checkedCount < checkedItems.length ? (
            <>Noch {checkedItems.length - checkedCount} Punkte offen</>
          ) : submitted ? (
            <>
              <CheckSquare className="mr-2 h-5 w-5" />
              Abgeschlossen
            </>
          ) : (
            <>
              <CheckSquare className="mr-2 h-5 w-5" />
              {completeButtonLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}