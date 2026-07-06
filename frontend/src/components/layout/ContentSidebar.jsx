import { Search, ChevronLeft, ChevronDown, ChevronRight, Lock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"

export default function ContentSidebar({
  open,
  onClose,
  modules,
  expandedModules,
  toggleModule,
  activeWorksheetId,
  onSelectWorksheet,
  enabledSlugs,
}) {
  // enabledSlugs === null means no restriction is known/applies (e.g. not logged in) — show everything unlocked
  const isLocked = (sheetId) => enabledSlugs !== null && !enabledSlugs.has(sheetId)
  return (
    <aside
      className={`
        fixed top-0 left-0 bottom-24 z-50 flex w-80 flex-col bg-white shadow-2xl
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex items-center justify-between border-b border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-900">Inhalt</h2>

        <button
          onClick={onClose}
          className="rounded-lg p-2 transition-colors hover:bg-slate-100"
        >
          <ChevronLeft className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      <div className="border-b border-slate-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Suche..." className="pl-10" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {modules.map((module) => (
          <div key={module.title} className="mb-2">
            <button
              onClick={() => toggleModule(module.title)}
              className="group flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-slate-50"
            >
              <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
                {module.title}
              </span>

              {expandedModules.includes(module.title) ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </button>

            <AnimatePresence initial={false}>
              {expandedModules.includes(module.title) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 space-y-1 pl-2">
                    {module.sheets.map((sheet) => {
                      const locked = isLocked(sheet.id)

                      return (
                        <button
                          key={sheet.id}
                          onClick={() => !locked && onSelectWorksheet(sheet.id)}
                          disabled={locked}
                          className={`
                            flex w-full items-center gap-2 rounded-lg p-3 text-left text-sm transition-all
                            ${
                              locked
                                ? "cursor-not-allowed text-slate-400"
                                : activeWorksheetId === sheet.id
                                  ? "bg-blue-600 font-semibold text-white"
                                  : "text-slate-600 hover:bg-sky-50 hover:text-blue-600"
                            }
                          `}
                        >
                          {locked && <Lock className="h-3.5 w-3.5 shrink-0" />}
                          <span>{sheet.title}</span>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </aside>
  )
}