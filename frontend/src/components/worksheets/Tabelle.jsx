import { Link } from "react-router-dom"

import { useState } from "react"
import { Table, Plus, Trash2, Sparkles, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Tabelle() {

  const [rows, setRows] = useState([
    { id: 1, beruf: "", vorteile: "", nachteile: "", voraussetzungen: "" }
  ])

  const [showTip, setShowTip] = useState(false)
  const [highlightedRow, setHighlightedRow] = useState(null)

  const addRow = () => {
    const newRow = {
      id: Date.now(),
      beruf: "",
      vorteile: "",
      nachteile: "",
      voraussetzungen: ""
    }

    setRows([...rows, newRow])
  }

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

  const isRowComplete = (row) => {
    return (
      row.beruf.length > 2 &&
      row.vorteile.length > 5 &&
      row.nachteile.length > 5 &&
      row.voraussetzungen.length > 5
    )
  }

  const updateCell = (id, field, value) => {

    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    )

    setRows(updatedRows)

    const currentRow = updatedRows.find((r) => r.id === id)

    if (currentRow && isRowComplete(currentRow)) {

      setHighlightedRow(id)

      setTimeout(() => setHighlightedRow(null), 2000)

      if (updatedRows.every(isRowComplete)) {
        setShowTip(true)
        setTimeout(() => setShowTip(false), 3500)
      }
    }
  }

  const completedRows = rows.filter(isRowComplete).length


  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">


      {/* HEADER */}

      <Card className="rounded-3xl border border-sky-200 bg-sky-50 shadow-sm">

        <CardHeader className="flex items-center gap-3 px-8 py-6">

          <Table className="h-8 w-8 text-blue-600" />

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Arbeitsblatt: Berufsvergleich
            </h1>
            <p className="text-slate-600">Design-Typ: Tabelle</p>
          </div>

        </CardHeader>

      </Card>



      {/* PROGRESS */}

      <Card className="rounded-3xl border border-slate-200 shadow-sm">

        <CardContent className="flex items-center justify-between px-8 py-6">

          <span className="font-semibold text-slate-600">
            Berufe analysiert
          </span>

          <div className="flex items-center gap-4">

            <div className="text-3xl font-black text-blue-600">
              {completedRows}/{rows.length}
            </div>

            <Button onClick={addRow} className="flex items-center gap-2">

              <Plus className="h-4 w-4" />

              Beruf hinzufügen

            </Button>

          </div>

        </CardContent>

      </Card>



      {/* TABLE */}

      <div className="relative">

        <AnimatePresence>

          {showTip && (

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 bg-lime-400 text-slate-900 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
            >

              <Sparkles className="h-5 w-5" />

              <span className="font-bold">
                Hervorragend! Alle Berufe analysiert!
              </span>

            </motion.div>

          )}

        </AnimatePresence>



        <div className="rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-gradient-to-r from-blue-600 to-sky-500 text-white">

                  <th className="px-6 py-4 text-left w-48">Beruf</th>

                  <th className="px-6 py-4 text-left">Vorteile</th>

                  <th className="px-6 py-4 text-left">Nachteile</th>

                  <th className="px-6 py-4 text-left">Voraussetzungen</th>

                  <th className="px-6 py-4 text-center w-24">Aktion</th>

                </tr>

              </thead>



              <tbody>

                {rows.map((row, index) => (

                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b border-slate-100 transition-all ${
                      highlightedRow === row.id
                        ? "bg-lime-200/30"
                        : "hover:bg-slate-50"
                    }`}
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2">

                        <Input
                          value={row.beruf}
                          onChange={(e) =>
                            updateCell(row.id, "beruf", e.target.value)
                          }
                          placeholder="z.B. Arzt / Ärztin"
                        />

                        {isRowComplete(row) && (
                          <CheckCircle2 className="h-5 w-5 text-lime-400" />
                        )}

                      </div>

                    </td>



                    <td className="px-6 py-4">

                      <Textarea
                        rows={2}
                        value={row.vorteile}
                        onChange={(e) =>
                          updateCell(row.id, "vorteile", e.target.value)
                        }
                        placeholder="Was spricht dafür?"
                      />

                    </td>



                    <td className="px-6 py-4">

                      <Textarea
                        rows={2}
                        value={row.nachteile}
                        onChange={(e) =>
                          updateCell(row.id, "nachteile", e.target.value)
                        }
                        placeholder="Was könnte schwierig sein?"
                      />

                    </td>



                    <td className="px-6 py-4">

                      <Textarea
                        rows={2}
                        value={row.voraussetzungen}
                        onChange={(e) =>
                          updateCell(row.id, "voraussetzungen", e.target.value)
                        }
                        placeholder="Was wird benötigt?"
                      />

                    </td>



                    <td className="px-6 py-4 text-center">

                      {rows.length > 1 && (

                        <button
                          onClick={() => removeRow(row.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >

                          <Trash2 className="h-5 w-5" />

                        </button>

                      )}

                    </td>

                  </motion.tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>



      {/* INFO BOX */}

      <Card className="rounded-3xl border border-sky-200 bg-sky-50">

        <CardContent className="flex items-start gap-3 px-8 py-6">

          <Sparkles className="h-6 w-6 text-sky-500 mt-1" />

          <div>

            <p className="font-bold text-slate-900 mb-1">
              Tipp zum Ausfüllen
            </p>

            <p className="text-sm text-slate-700">
              Recherchiere gründlich zu jedem Beruf. Je detaillierter deine Angaben,
              desto besser kannst du die verschiedenen Berufe miteinander vergleichen!
            </p>

          </div>

        </CardContent>

      </Card>



      {/* SUBMIT */}

      <div className="flex justify-center pt-4">

        <Button disabled={completedRows < 1} className="px-8 py-6 rounded-2xl font-bold">

          {completedRows < 1
            ? "Mindestens einen Beruf vollständig analysieren"
            : "Analyse abschließen"}

        </Button>

      </div>

    </div>
  )
}