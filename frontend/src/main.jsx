import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./index.css"

import App from "./App.jsx"
import Arbeitsblätter from "./arbeitsblaetter.jsx"
import Login from "./login.jsx"
import Gruppe from "./gruppe.jsx"
import OffeneFragen from "./OffeneFragen.jsx"
import FragenTabellen from "./FragenTabellen.jsx";
import Informationstext from "./Informationstext.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/arbeitsblaetter" element={<Arbeitsblätter/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/gruppe" element={<Gruppe />} />
                <Route path="/OffeneFragen" element={<OffeneFragen />} />
                <Route path="/FragenTabellen" element={<FragenTabellen />} />
                <Route path ="/Informationstext" element= {<Informationstext />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)