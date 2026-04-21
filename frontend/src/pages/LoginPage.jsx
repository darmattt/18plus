import React, { useState } from "react"
import { LogIn, Mail, Lock, X } from "lucide-react"

export const LoginBox = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">

        {/* Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-[#c7d300] via-[#00a7e7] to-[#006ddd]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-8">

          <div className="text-center mb-8">
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

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                E-Mail
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.de"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                Passwort
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-4 bg-[#c7d300] text-black rounded-xl font-bold hover:bg-[#b0ba00] transition-colors shadow-lg shadow-[#c7d300]/20 flex items-center justify-center gap-2"
            >
              Anmelden <LogIn className="w-5 h-5" />
            </button>

          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-[#006ddd] hover:underline font-medium">
              Passwort vergessen?
            </a>
          </div>

          <div className="mt-4 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Noch kein Konto?{" "}
              <a href="#" className="text-[#00a7e7] hover:underline font-bold">
                Jetzt registrieren
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}