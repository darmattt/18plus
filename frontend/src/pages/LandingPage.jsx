import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Trophy, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { LoginBox } from "./LoginPage.jsx"
import { RegistrationBox } from "./RegistrationPage.jsx"
import { loginTeacher, setTeacherToken } from "@/api/teacherApi"
import { verifyStudentLoginCode } from "@/api/studentApi"

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (role, email, passwordOrCode) => {
    try {
      if (role === "teacher") {
        const result = await loginTeacher(email, passwordOrCode)
        const token = result.token || result.jwt || result.accessToken

        if (!token) {
          console.log("Teacher login response:", result)
          throw new Error("Kein Teacher-Token gefunden")
        }

        setTeacherToken(token)
        setShowLogin(false)
        navigate("/TeacherView")
        return
      }

      if (role === "student") {
        await verifyStudentLoginCode(email, passwordOrCode)
        setShowLogin(false)
        navigate("/arbeitsblaetter")
      }
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-3">
          <img src="/18plus_Logo_RGB.png" alt="18 Plus logo" className="w-28 sm:w-36 md:w-40" />
        </div>

        <Button
          variant="outline"
          className="inline-flex"
          onClick={() => setShowLogin(true)}
        >
          Login
        </Button>
      </header>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-8 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="order-2 lg:order-1">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            18plus <br />
            wegweisend zu <br />
            <span className="text-sky-500">Studium und Beruf</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:mt-6 sm:text-lg">
            Die Matura naht mit raschen Schritten. Wissen Sie schon, was Sie danach
            machen werden? Das Berufs- und Studienorientierungsprogramm 18plus
            begleitet Sie auf dem Weg zu Ihrer Entscheidung.
          </p>

          <div className="mt-8 sm:mt-10">
            <Button
              size="lg"
              className="w-full rounded-2xl bg-lime-300 px-7 py-6 text-slate-900 hover:bg-lime-400 sm:w-auto"
              onClick={() => navigate("/arbeitsblaetter")}
            >
              Jetzt starten
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="grid gap-4 sm:gap-5">
            <Card className="rounded-[28px] border-slate-200/60 bg-gradient-to-br from-sky-50 via-white to-lime-50 shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sky-100 text-sky-600">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-wide text-sky-600">
                      Orientierung
                    </div>
                    <div className="mt-1 text-xl font-bold text-slate-900">
                      Finde heraus, was zu dir passt
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                      Arbeitsblaetter, Reflexionen und naechste Schritte helfen dir
                      dabei, eigene Staerken und Interessen sichtbar zu machen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-slate-200/60 bg-white shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lime-100 text-lime-700">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-wide text-lime-700">
                      Nächster Schritt
                    </div>
                    <div className="mt-1 text-xl font-bold text-slate-900">
                      Bleib dran bis zur Entscheidung
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                      Von der ersten Standortbestimmung bis zu konkreten
                      Berufsvorschlaegen bleibt alles an einem Ort gesammelt.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {showLogin && (
        <LoginBox
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
          onRegister={() => {
            setShowLogin(false)
            setShowRegistration(true)
          }}
        />
      )}

      {showRegistration && (
        <RegistrationBox
          onClose={() => setShowRegistration(false)}
          onRegisterSuccess={() => {
            setShowRegistration(false)
            navigate("/arbeitsblaetter")
          }}
          onBackToLogin={() => {
            setShowRegistration(false)
            setShowLogin(true)
          }}
        />
      )}
    </div>
  )
}
