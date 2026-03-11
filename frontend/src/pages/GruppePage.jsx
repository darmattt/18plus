import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Gruppe() {
    return (
              <div className="min-h-screen bg-white">
                       {/* Top bar */}
                       <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
                           <div className="flex items-center gap-3">
                               <Link to = "/">
                               <img src="18plus_Logo_RGB.png" alt="18 Plus logo" className="w-40"/>
                                </Link>
                           </div>

                           <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
                               <Link className="hover:text-slate-900" to="/arbeitsblaetter">
                                   Arbeitsblätter
                               </Link>
                               <Link className="hover:text-slate-900" to="/gruppe">
                                   Gruppe beitreten
                               </Link>
                               <a className="hover:text-slate-900" href="#">
                                   über 18plus
                               </a>
                           </nav>

                           <Link to="/login">
                           <Button variant="outline" className="hidden md:inline-flex">
                               Login
                           </Button>
                           </Link>
                       </header>

            {/* Content */}
            <div className="p-10">
                <h1 className="text-3xl font-bold">Gruppe</h1>
                <p>das hier ist die gruppe</p>
            </div>

        </div>
    )
}