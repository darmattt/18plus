import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Trophy, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* TOP BAR */}

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">

        <div className="flex items-center gap-3">
          <img
            src="/18plus_Logo_RGB.png"
            alt="18 Plus logo"
            className="w-40"
          />
        </div>

        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">

          <Link className="hover:text-slate-900" to="/arbeitsblaetter">
            Arbeitsblätter
          </Link>

          <Link className="hover:text-slate-900" to="/GrupppePage">
            Gruppe beitreten
          </Link>


          <Link className="hover:text-slate-900" to="/CoursePage">
                      Gruppe beitreten
                    </Link>

          <Link className="hover:text-slate-900" to ="/AdminLogIn">
            Admin Login
          </Link>

        </nav>

        <Link to="/login">
          <Button variant="outline" className="hidden md:inline-flex">
            <Link className="hover:text-slate-900" to="/LoginPage">
              Login
            </Link>
          </Button>
        </Link>

      </header>


      {/* HERO SECTION */}

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 pb-16 pt-8 md:grid-cols-2 md:items-center">


        {/* LEFT SIDE */}

        <div>

          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
            18plus <br />
            wegweisend zu <br />
            <span className="text-sky-500">
              Studium und Beruf
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            Die moderne Lernplattform, die dir hilft,
            deinen Fortschritt zu verfolgen
            und in deinem Studium zu glänzen.
          </p>

          <div className="mt-10">

            {/* BUTTON → öffnet Worksheet Plattform */}

            <Link to="/arbeitsblaetter">

              <Button
                size="lg"
                className="rounded-2xl bg-lime-300 px-7 py-6 text-slate-900 hover:bg-lime-400"
              >
                Jetzt starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

            </Link>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="relative">

          <div className="relative overflow-hidden rounded-[32px] bg-slate-100 shadow-sm">

            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80"
              alt="Students studying"
              className="h-[520px] w-full object-cover"
            />

          </div>


          {/* FLOATING CARD 1 */}

          <Card className="absolute right-4 top-4 w-[240px] rounded-2xl border-slate-200/60 bg-white/95 shadow-lg">

            <CardContent className="flex items-center gap-3 p-4">

              <div className="grid h-10 w-10 place-items-center rounded-full bg-sky-50 text-sky-600">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div className="leading-tight">
                <div className="text-xs text-slate-500">
                  Level Up
                </div>
                <div className="font-semibold text-slate-900">
                  Fortgeschritten
                </div>
              </div>

            </CardContent>

          </Card>


          {/* FLOATING CARD 2 */}

          <Card className="absolute bottom-6 left-6 w-[300px] rounded-2xl border-slate-200/60 bg-white shadow-lg">

            <CardContent className="flex items-center gap-3 p-4">

              <div className="grid h-10 w-10 place-items-center rounded-full bg-lime-50 text-lime-700">
                <Trophy className="h-5 w-5" />
              </div>

              <div className="leading-tight">
                <div className="text-xs text-slate-500">
                  Letztes Ergebnis
                </div>

                <div className="font-semibold text-slate-900">
                  Mathematik:
                  <span className="font-extrabold">
                    {" "}98%
                  </span>
                </div>

              </div>

            </CardContent>

          </Card>

        </div>

      </main>

    </div>
  )
}