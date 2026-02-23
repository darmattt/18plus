import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./index.css"

import App from "./App.jsx"
import Features from "./features.jsx"
import Login from "./login.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/features" element={<Features />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)