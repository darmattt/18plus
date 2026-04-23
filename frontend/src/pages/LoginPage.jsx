import React, { useState } from "react"
import { LogIn, Mail, Lock, X } from "lucide-react"

export const LoginBox = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onLogin(email, password)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="h-2 bg-gradient-to-r from-[#c7d300] via-[#00a7e7] to-[#006ddd]" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#006ddd]">
              <LogIn className="h-8 w-8 text-white" />
            </div>

            <h2 className="mb-2 text-3xl font-extrabold text-gray-900">
              Willkommen zurück!
            </h2>

            <p className="text-gray-600">Melde dich an, um fortzufahren</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-gray-700">
                E-Mail
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.de"
                  required
                  className="w-full rounded-xl border-2 border-gray-200 py-3 pl-12 pr-4 transition-all focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold text-gray-700">
                Passwort
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border-2 border-gray-200 py-3 pl-12 pr-4 transition-all focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c7d300] py-4 font-bold text-black shadow-lg shadow-[#c7d300]/20 transition-colors hover:bg-[#b0ba00]"
            >
              Anmelden
              <LogIn className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}