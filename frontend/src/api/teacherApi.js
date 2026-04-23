const API_BASE_URL = "http://localhost:5000/api/Teacher"

export function getTeacherToken() {
  return localStorage.getItem("teacherToken")
}

export function setTeacherToken(token) {
  localStorage.setItem("teacherToken", token)
}

export function removeTeacherToken() {
  localStorage.removeItem("teacherToken")
}

async function teacherFetch(path, options = {}) {
  const token = getTeacherToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = `Request failed: ${response.status}`

    try {
      const errorData = await response.json()
      message = errorData.message || errorData.title || message
    } catch {
      // ignore
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export async function loginTeacher(emailAddress, password) {
  return teacherFetch("/login", {
    method: "POST",
    body: JSON.stringify({
      emailAddress,
      password,
    }),
  })
}

export async function getStudentResults() {
  return teacherFetch("/results", {
    method: "GET",
  })
}