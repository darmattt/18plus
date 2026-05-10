const API_BASE_URL = "http://localhost:5000/api/Student"

export function getStudentToken() {
  return localStorage.getItem("studentToken")
}

export function setStudentToken(token) {
  localStorage.setItem("studentToken", token)
}

export function removeStudentToken() {
  localStorage.removeItem("studentToken")
}

async function apiRequest(path, options = {}) {
  const token = getStudentToken()

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`

    try {
      const errorData = await response.json()
      errorMessage =
        errorData.message ||
        errorData.title ||
        errorData.error ||
        JSON.stringify(errorData)
    } catch {
      try {
        errorMessage = await response.text()
      } catch {
        // ignore
      }
    }

    throw new Error(errorMessage || "Request fehlgeschlagen")
  }

  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function loginStudent(emailAddress, oneTimeCode = null) {
  return apiRequest("/login", {
    method: "POST",
    body: JSON.stringify({
      emailAddress,
      oneTimeCode,
    }),
  })
}