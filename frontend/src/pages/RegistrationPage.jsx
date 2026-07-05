import React, { useState, useEffect } from "react"
import { UserPlus, Mail, User, X, Key, Send, CheckCircle } from "lucide-react"

export const RegistrationBox = ({
  onClose,
  onRegisterSuccess,
  onBackToLogin,
}) => {
  const [step, setStep] = useState("info")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmitInfo = (e) => {
    e.preventDefault()
    console.log("Registration info submitted:", { firstName, lastName, email })
    setStep("verify")
    setCountdown(60)
  }

  const handleResendCode = () => {
    console.log("Resending verification code to:", email)
    setCountdown(60)
  }

  const handleVerifyCode = (e) => {
    e.preventDefault()

    if (verificationCode === "676767") {
      console.log("Registration successful!")
      onRegisterSuccess()
    } else {
      alert("Ungültiger Code. Bitte versuche es erneut.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#c7d300] via-[#00a7e7] to-[#006dd6]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {step === "info" ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00a7e7] rounded-full mb-4">
                  <UserPlus className="text-white w-8 h-8" />
                </div>

                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                  Jetzt registrieren
                </h2>

                <p className="text-gray-600">
                  Erstelle dein Konto als Studierende:r
                </p>
              </div>

              <form onSubmit={handleSubmitInfo} className="space-y-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Vorname
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Max"
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Nachname
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Mustermann"
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    E-Mail
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="max.mustermann@student.de"
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="LernGruppeCode"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Code für deine Lerngruppe
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                    <input
                      id="lgCode"
                      type="lgCode"
                      value={email}
                      //onChange={(e) => setEmail(e.target.value)}
                      placeholder="123456"
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#c7d300] text-black rounded-xl font-bold hover:bg-[#b0ba00] transition-colors shadow-lg shadow-[#c7d300]/20 flex items-center justify-center gap-2"
                >
                  Weiter <Send className="w-5 h-5" />
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Schon ein Konto?{" "}
                  <button
                    onClick={onBackToLogin}
                    className="text-[#006dd6] hover:underline font-bold"
                  >
                    Zum Login
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00a7e7] rounded-full mb-4">
                  <Key className="text-white w-8 h-8" />
                </div>

                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                  Bestätige deine E-Mail
                </h2>

                <p className="text-gray-600">
                  Wir haben einen Code an <strong>{email}</strong> gesendet
                </p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label
                    htmlFor="verificationCode"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Bestätigungscode
                  </label>

                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                    <input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="676767"
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all text-center text-xl tracking-widest"
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Gib den 6-stelligen Code ein, den du per E-Mail erhalten hast
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={countdown > 0}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    countdown > 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white border-2 border-[#00a7e7] text-[#00a7e7] hover:bg-[#00a7e7] hover:text-white"
                  }`}
                >
                  {countdown > 0
                    ? `Code erneut senden (${countdown}s)`
                    : "Code erneut senden"}
                </button>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#c7d300] text-black rounded-xl font-bold hover:bg-[#b0ba00] transition-colors shadow-lg shadow-[#c7d300]/20 flex items-center justify-center gap-2"
                >
                  Registrierung abschließen <CheckCircle className="w-5 h-5" />
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <button
                  onClick={onBackToLogin}
                  className="text-sm text-[#006dd6] hover:underline font-medium"
                >
                  Zurück zum Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}