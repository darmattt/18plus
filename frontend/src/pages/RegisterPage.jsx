import { useNavigate, useSearchParams } from "react-router-dom"

import { RegistrationBox } from "./RegistrationPage.jsx"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialJoinCode = searchParams.get("code") || ""

  return (
    <RegistrationBox
      initialJoinCode={initialJoinCode}
      onClose={() => navigate("/")}
      onRegisterSuccess={() => navigate("/arbeitsblaetter")}
      onBackToLogin={() => navigate("/")}
    />
  )
}
