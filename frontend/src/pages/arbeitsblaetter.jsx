import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Arbeitsblaetter() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img
              src="18plus_Logo_RGB.png"
              alt="18 Plus logo"
              className="w-28 cursor-pointer transition hover:opacity-80 sm:w-36 md:w-40"
            />
          </Link>
        </div>

        <Link to="/login">
          <Button variant="outline" className="inline-flex">
            Login
          </Button>
        </Link>
      </header>

      <div className="px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-bold sm:text-3xl">Arbeitsblaetter</h1>
        <p className="mt-4 text-slate-600">This is the features page.</p>
        <p>hey</p>
      </div>
    </div>
  )
}
