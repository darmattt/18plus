import React, { useState, useRef, useEffect } from "react"
import { Send, X, Bot, User } from "lucide-react"
import { motion } from "framer-motion"

export const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hallo! Ich bin dein Lern-Fuchs. Wie kann ich dir heute bei deinen Tests helfen?",
      sender: "bot",
    },
  ])

  const [input, setInput] = useState("")
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")

    setTimeout(() => {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: "Das ist eine tolle Frage! Als dein Maskottchen helfe ich dir gerne dabei, die richtige Antwort in deinem Modul zu finden.",
        sender: "bot",
      }

      setMessages((prev) => [...prev, botMsg])
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-28 right-6 w-80 md:w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-[60]"
    >
      <div className="bg-[#006ddd] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-white shrink-0">
            <img
              src="https://images.unsplash.com/photo-1613206468203-fa00870edf79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0b29uJTIwZm94JTIwd2l0aCUyMGdsYXNzZXMlMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzcwNzI1MDE5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Mascot"
              className="w-full h-full object-cover scale-110"
            />
          </div>

          <div>
            <h3 className="text-white font-bold leading-none">Lern-Fuchs</h3>
            <span className="text-[#c7d300] text-xs font-bold uppercase tracking-wider">
              Online
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors p-1"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex gap-2 max-w-[80%] ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.sender === "user"
                    ? "bg-[#00a7e7] text-white"
                    : "bg-[#c7d300] text-black"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div className="relative">
                <div
                  className={`p-3 rounded-2xl text-sm font-medium ${
                    msg.sender === "user"
                      ? "bg-[#006ddd] text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Schreibe eine Nachricht..."
            className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#00a7e7] transition-all"
          />

          <button
            type="submit"
            className="bg-[#c7d300] text-black p-2 rounded-xl hover:bg-[#b0ba00] transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </motion.div>
  )
}