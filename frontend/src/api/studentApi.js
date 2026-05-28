const API_BASE_URL = "/api/Student"
const STUDENT_TOKEN_KEY = "studentToken"

export function setStudentToken(token) {
  localStorage.setItem(STUDENT_TOKEN_KEY, token)
}

export function getStudentToken() {
  return localStorage.getItem(STUDENT_TOKEN_KEY)
}

export function removeStudentToken() {
  localStorage.removeItem(STUDENT_TOKEN_KEY)
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

  if (response.status === 401 || response.status === 403) {
    removeStudentToken()
  }

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

export async function requestStudentLoginCode(emailAddress) {
  return apiRequest("/login/request-code", {
    method: "POST",
    body: JSON.stringify({
      EmailAddress: emailAddress,
    }),
  })
}

export async function verifyStudentLoginCode(emailAddress, oneTimeCode) {
  const data = await apiRequest("/login/verify-code", {
    method: "POST",
    body: JSON.stringify({
      EmailAddress: emailAddress,
      OneTimeCode: oneTimeCode,
    }),
  })

  const token =
    data?.accessToken ||
    data?.token ||
    data?.jwt ||
    data?.access_token

  if (!token) {
    throw new Error("Kein Student-Token in der Login-Antwort gefunden")
  }

  setStudentToken(token)
  return data
}

export async function getStudentProfile() {
  return apiRequest("/me", {
    method: "GET",
  })
}

export function logoutStudent() {
  removeStudentToken()
}
