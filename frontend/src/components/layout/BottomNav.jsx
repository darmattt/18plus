import { List, User, MessageCircle } from "lucide-react"

export default function BottomNav({
  sidebarOpen,
  activeView,
  chatOpen,
  onToggleSidebar,
  onOpenProfile,
  onToggleChat,
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-24 items-center justify-center border-t border-slate-100 bg-white/85 backdrop-blur-md">
      <div className="flex w-full max-w-2xl items-center gap-1 px-4 md:gap-4">
        <button
          onClick={onToggleSidebar}
          className={`
            flex-1 rounded-2xl py-4 font-bold transition-all
            flex items-center justify-center gap-3
            ${
              sidebarOpen || activeView === "content"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }
          `}
        >
          <List className="h-5 w-5" />
          <span className="hidden sm:inline">Inhalt</span>
        </button>

        <button
          onClick={onOpenProfile}
          className={`
            flex-1 rounded-2xl py-4 font-bold transition-all
            flex items-center justify-center gap-3
            ${
              activeView === "profile"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }
          `}
        >
          <User className="h-5 w-5" />
          <span className="hidden sm:inline">Mein Profil</span>
        </button>

        <button
          onClick={onToggleChat}
          className={`
            flex-1 rounded-2xl py-4 font-bold transition-all
            flex items-center justify-center gap-3
            ${
              chatOpen
                ? "bg-lime-400 text-slate-900 shadow-lg shadow-lime-400/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }
          `}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Chat</span>
        </button>
      </div>
    </nav>
  )
}