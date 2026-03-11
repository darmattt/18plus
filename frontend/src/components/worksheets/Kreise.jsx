import { Link } from "react-router-dom"

import { useMemo, useState } from "react"
import { Circle, X, CheckCircle2, Sparkles } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const initialCircles = [
  {
    id: 1,
    label: "Stärken",
    question: "Was sind deine drei größten Stärken?",
    answer: "",
    completed: false,
    position: { x: 20, y: 20 },
    color: "#006ddd",
  },
  {
    id: 2,
    label: "Interessen",
    question: "Welche Themen interessieren dich besonders?",
    answer: "",
    completed: false,
    position: { x: 60, y: 15 },
    color: "#00a7e7",
  },
  {
    id: 3,
    label: "Werte",
    question: "Was ist dir im Berufsleben wichtig?",
    answer: "",
    completed: false,
    position: { x: 15, y: 55 },
    color: "#c7d300",
  },
  {
    id: 4,
    label: "Ziele",
    question: "Welche beruflichen Ziele hast du?",
    answer: "",
    completed: false,
    position: { x: 65, y: 60 },
    color: "#006ddd",
  },
  {
    id: 5,
    label: "Erfahrungen",
    question: "Welche praktischen Erfahrungen hast du schon gesammelt?",
    answer: "",
    completed: false,
    position: { x: 42, y: 45 },
    color: "#00a7e7",
  },
]

export default function Kreise() {
  const [circles, setCircles] = useState(initialCircles)
  const [selectedCircle, setSelectedCircle] = useState(null)
  const [showCelebration, setShowCelebration] = useState(false)

  const completedCount = useMemo(
    () => circles.filter((circle) => circle.completed).length,
    [circles]
  )

  const progressValue = (completedCount / circles.length) * 100

  const selectedCircleData = useMemo(
    () => circles.find((circle) => circle.id === selectedCircle) ?? null,
    [circles, selectedCircle]
  )

  const handleCircleClick = (id) => {
    setSelectedCircle(id)
  }

  const handleSaveAnswer = (id, answer) => {
    const updatedCircles = circles.map((circle) =>
      circle.id === id
        ? { ...circle, answer, completed: answer.trim().length > 10 }
        : circle
    )

    setCircles(updatedCircles)

    if (answer.trim().length > 10) {
      const allCompleted = updatedCircles.every((circle) => circle.completed)
      if (allCompleted) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    }
  }

  const handleClose = () => {
    setSelectedCircle(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <Card className="overflow-hidden rounded-3xl border border-lime-200 bg-gradient-to-r from-lime-50 to-sky-50 shadow-sm">
          <CardHeader className="space-y-2 px-5 py-5 md:px-8 md:py-6">
            <div className="flex items-center gap-3">
              <Circle className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Arbeitsblatt: Interaktive Kreise
              </h1>
            </div>
            <p className="text-sm text-slate-600 md:text-base">
              Design-Typ: Kreise
            </p>
            <p className="text-sm text-slate-500">
              Klicke auf einen Kreis, um die Frage zu beantworten
            </p>
          </CardHeader>
        </Card>

        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardContent className="flex items-center justify-between px-8 py-7">
            <div className="text-[18px] font-semibold text-slate-600">
              Fortschritt
            </div>

            <div className="flex items-center gap-4">
              <div className="text-4xl font-black leading-none text-blue-600">
                {completedCount}/{circles.length}
              </div>

              <div className="flex items-center gap-2">
                {circles.map((circle) => (
                  <div
                    key={circle.id}
                    className={`h-4 w-4 rounded-full ${
                      circle.completed ? "bg-lime-400" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="relative aspect-[16/10] rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm md:p-12">
          {circles.map((circle) => (
            <motion.button
              key={circle.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: circle.id * 0.08, type: "spring" }}
              whileHover={{ scale: 1.08 }}
              onClick={() => handleCircleClick(circle.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${circle.position.x}%`,
                top: `${circle.position.y}%`,
              }}
            >
              <div
                className={`flex h-24 w-24 flex-col items-center justify-center rounded-full px-2 text-center shadow-lg transition-all md:h-32 md:w-32 ${
                  circle.completed
                    ? "ring-4 ring-lime-400"
                    : "hover:ring-4 hover:ring-slate-300"
                }`}
                style={{
                  backgroundColor: circle.completed
                    ? circle.color
                    : `${circle.color}40`,
                }}
              >
                <span className="text-xs font-bold text-white md:text-sm">
                  {circle.label}
                </span>

                {circle.completed && (
                  <CheckCircle2 className="mt-2 h-5 w-5 text-white md:h-6 md:w-6" />
                )}
              </div>
            </motion.button>
          ))}

          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="absolute left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-3xl bg-lime-400 px-6 py-5 text-slate-900 shadow-2xl"
              >
                <Sparkles className="h-7 w-7" />
                <span className="text-lg font-black md:text-2xl">
                  Alle Kreise beantwortet!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedCircle && selectedCircleData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6"
              onClick={handleClose}
            >
              <motion.div
                initial={{ scale: 0.85, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 40 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8"
              >
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-slate-100"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>

                <div
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ backgroundColor: selectedCircleData.color }}
                >
                  <span className="text-sm font-bold text-white">
                    {selectedCircleData.label}
                  </span>
                </div>

                <h3 className="mb-6 text-xl font-bold text-slate-900 md:text-2xl">
                  {selectedCircleData.question}
                </h3>

                <Textarea
                  value={selectedCircleData.answer}
                  onChange={(e) =>
                    handleSaveAnswer(selectedCircle, e.target.value)
                  }
                  placeholder="Deine Antwort hier eingeben..."
                  rows={6}
                  autoFocus
                  className="mb-4 min-h-[140px] resize-none rounded-2xl border-slate-200 px-4 py-3 focus-visible:ring-2 focus-visible:ring-sky-400"
                />

                {selectedCircleData.answer.trim().length > 10 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-center gap-2 text-lime-600"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-semibold">
                      Antwort gespeichert!
                    </span>
                  </motion.div>
                )}

                <Button
                  onClick={handleClose}
                  className="w-full rounded-2xl py-6 text-base font-bold"
                >
                  Schließen
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}