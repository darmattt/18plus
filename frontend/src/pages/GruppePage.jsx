import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Gruppe() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img
              src="18plus_Logo_RGB.png"
              alt="18 Plus logo"
              className="w-28 sm:w-36 md:w-40"
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link className="hover:text-slate-900" to="/arbeitsblaetter">
            Arbeitsblaetter
          </Link>
          <Link className="hover:text-slate-900" to="/gruppe">
            Gruppe beitreten
          </Link>
        </nav>

        <Link to="/login">
          <Button variant="outline" className="inline-flex">
            Login
          </Button>
        </Link>
      </header>

      <div className="px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-bold sm:text-3xl">Gruppe</h1>
        <p className="mt-3 text-slate-600">das hier ist die gruppe</p>
      </div>
    </div>
  )
}
