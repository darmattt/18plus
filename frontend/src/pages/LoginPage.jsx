import React, { useState, useEffect } from "react"
import { LogIn, Mail, Lock, X, Key, Send } from "lucide-react"

export const LoginBox = ({ onClose, onLogin, onRegister }) => {
  const [activeTab, setActiveTab] = useState("student")

  const [teacherEmail, setTeacherEmail] = useState("")
  const [teacherPassword, setTeacherPassword] = useState("")

  const [studentEmail, setStudentEmail] = useState("")
  const [oneTimeCode, setOneTimeCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleTeacherSubmit = (e) => {
    e.preventDefault()
    onLogin("teacher", teacherEmail, teacherPassword)
  }

  const handleSendCode = () => {
    if (!studentEmail) return
    setCodeSent(true)
    setCountdown(60)
    console.log("One-time code sent to:", studentEmail)
  }

  const handleStudentSubmit = (e) => {
    e.preventDefault()
    onLogin("student", studentEmail, oneTimeCode)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#c7d300] via-[#00a7e7] to-[#006ddd]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#006ddd] rounded-full mb-4">
              <LogIn className="text-white w-8 h-8" />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Willkommen zurück!
            </h2>

            <p className="text-gray-600">
              Melde dich an, um fortzufahren
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("teacher")}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                activeTab === "teacher"
                  ? "bg-[#006ddd] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Als Betreuer:in einloggen
            </button>

            <button
              onClick={() => setActiveTab("student")}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                activeTab === "student"
                  ? "bg-[#006ddd] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Als Studierende einloggen
            </button>
          </div>

          {activeTab === "teacher" && (
            <form onSubmit={handleTeacherSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="teacher-email"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  E-Mail
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                  <input
                    id="teacher-email"
                    type="email"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    placeholder="deine@email.de"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="teacher-password"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Passwort
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                  <input
                    id="teacher-password"
                    type="password"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#c7d300] text-black rounded-xl font-bold hover:bg-[#b0ba00] transition-colors shadow-lg shadow-[#c7d300]/20 flex items-center justify-center gap-2"
              >
                Anmelden <LogIn className="w-5 h-5" />
              </button>

              <div className="text-center">
                <a href="#" className="text-sm text-[#006ddd] hover:underline font-medium">
                  Passwort vergessen?
                </a>
              </div>
            </form>
          )}

          {activeTab === "student" && (
            <form onSubmit={handleStudentSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="student-email"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  E-Mail
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                  <input
                    id="student-email"
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="deine@email.de"
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendCode}
                disabled={countdown > 0 || !studentEmail}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  countdown > 0 || !studentEmail
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#00a7e7] text-white hover:bg-[#0096d6] shadow-lg"
                }`}
              >
                {countdown > 0 ? (
                  <>Code erneut senden ({countdown}s)</>
                ) : (
                  <>
                    One-Time-Code senden <Send className="w-5 h-5" />
                  </>
                )}
              </button>

              {codeSent && (
                <div className="space-y-4 animate-in slide-in-from-top duration-300">
                  <div>
                    <label
                      htmlFor="one-time-code"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      One-Time-Code
                    </label>

                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                      <input
                        id="one-time-code"
                        type="text"
                        value={oneTimeCode}
                        onChange={(e) => setOneTimeCode(e.target.value)}
                        placeholder="123456"
                        required
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                      />
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Bitte gib den Code ein, der an deine E-Mail gesendet wurde.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#c7d300] text-black rounded-xl font-bold hover:bg-[#b0ba00] transition-colors shadow-lg shadow-[#c7d300]/20 flex items-center justify-center gap-2"
                  >
                    Anmelden <LogIn className="w-5 h-5" />
                  </button>
                </div>
              )}
            </form>
          )}

          {activeTab === "student" && (
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Noch kein Konto?{" "}
                <button
                  onClick={onRegister}
                  className="text-[#00a7e7] hover:underline font-bold"
                >
                  Jetzt registrieren
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}