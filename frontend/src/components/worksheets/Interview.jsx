import { Link } from "react-router-dom"

import { useState } from "react"
import { Users, MessageSquare, Sparkles, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Interview() {

  const [interviews, setInterviews] = useState([
    { person: "", notes: "", completed: false },
    { person: "", notes: "", completed: false },
    { person: "", notes: "", completed: false }
  ])

  const [showTip, setShowTip] = useState(null)

  const interviewQuestions = [
    "Frage eine Person aus deinem Umfeld: Was macht dir an deinem Beruf am meisten Spaß?",
    "Interview jemanden: Welche Fähigkeiten sind in deinem Job besonders wichtig?",
    "Befrage eine Fachperson: Wie sieht ein typischer Arbeitstag bei dir aus?"
  ]

  const tips = [
    "Tipp: Notiere auch Körpersprache und Emotionen!",
    "Super! Vergiss nicht nach konkreten Beispielen zu fragen.",
    "Toll gemacht! Auch Nachfragen sind wichtig."
  ]

  const updateCompleted = (index, interview) => {
    const newInterviews = [...interviews]

    newInterviews[index].completed =
      interview.person.length > 2 && interview.notes.length > 20

    setInterviews(newInterviews)
  }

  const handlePersonChange = (index, value) => {
    const newInterviews = [...interviews]
    newInterviews[index].person = value

    updateCompleted(index, newInterviews[index])
    setInterviews(newInterviews)
  }

  const handleNotesChange = (index, value) => {
    const newInterviews = [...interviews]
    newInterviews[index].notes = value

    updateCompleted(index, newInterviews[index])
    setInterviews(newInterviews)

    if (value.length > 30 && !newInterviews[index].completed) {
      setShowTip(index)
      setTimeout(() => setShowTip(null), 3500)
    }
  }

  const completedCount = interviews.filter((i) => i.completed).length

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-10">

      {/* HEADER */}

      <Card className="rounded-3xl border border-sky-200 bg-sky-50 shadow-sm">
        <CardHeader className="flex items-center gap-3 px-8 py-6">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Arbeitsblatt: Interview
            </h1>
            <p className="text-slate-600">Design-Typ: Interview</p>
          </div>
        </CardHeader>
      </Card>


      {/* QUESTIONS */}

      <div className="space-y-6">
        {interviewQuestions.map((question, index) => (

          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="relative"
          >

            <Card className="rounded-3xl border border-slate-200 shadow-sm">

              <CardContent className="px-8 py-6">

                <div className="flex items-start gap-4 mb-6">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white font-bold">
                    {index + 1}
                  </div>

                  <p className="flex-1 text-lg font-semibold text-slate-900">
                    {question}
                  </p>

                  {interviews[index].completed && (
                    <CheckCircle2 className="h-6 w-6 text-lime-400" />
                  )}

                </div>


                {/* INPUTS */}

                <div className="grid md:grid-cols-2 gap-5 ml-14">

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Users className="h-4 w-4 text-blue-600" />
                      Befragte Person
                    </label>

                    <Input
                      value={interviews[index].person}
                      onChange={(e) =>
                        handlePersonChange(index, e.target.value)
                      }
                      placeholder="Name oder Berufsbezeichnung"
                    />
                  </div>


                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      Antworten & Notizen
                    </label>

                    <Textarea
                      rows={3}
                      value={interviews[index].notes}
                      onChange={(e) =>
                        handleNotesChange(index, e.target.value)
                      }
                      placeholder="Notiere hier die Antworten..."
                    />
                  </div>

                </div>

              </CardContent>

            </Card>


            {/* TIP */}

            <AnimatePresence>

              {showTip === index && (

                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute -top-4 right-6 bg-lime-400 text-slate-900 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-bold">
                    {tips[index]}
                  </span>
                </motion.div>

              )}

            </AnimatePresence>

          </motion.div>

        ))}
      </div>


      {/* FOOTER */}

      <Card className="rounded-3xl border border-slate-200 shadow-sm">

        <CardContent className="flex items-center justify-between px-8 py-6">

          <div className="flex items-center gap-3">
            <div className="text-4xl font-black text-blue-600">
              {completedCount}/3
            </div>

            <span className="text-slate-600">
              Interviews abgeschlossen
            </span>
          </div>


          <Button
            disabled={completedCount < 3}
            className="px-8 py-6 rounded-2xl text-base font-bold"
          >
            Arbeitsblatt einreichen
          </Button>

        </CardContent>

      </Card>

    </div>
  )
}