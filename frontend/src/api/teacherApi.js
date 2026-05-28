const API_BASE_URL = "/api/Teacher"
const TEACHER_TOKEN_KEY = "teacherToken"

export function setTeacherToken(token) {
  localStorage.setItem(TEACHER_TOKEN_KEY, token)
}

export function getTeacherToken() {
  return localStorage.getItem(TEACHER_TOKEN_KEY)
}

export function removeTeacherToken() {
  localStorage.removeItem(TEACHER_TOKEN_KEY)
}

async function refreshTeacherToken() {
  const response = await fetch(`${API_BASE_URL}/teacher/refresh`, {
    method: "POST",
    credentials: "include",
  })

  if (!response.ok) {
    removeTeacherToken()
    throw new Error("Session abgelaufen. Bitte neu einloggen.")
  }

  const data = await response.json()
  const token = data?.accessToken || data?.token || data?.jwt

  if (!token) {
    throw new Error("Kein neuer Access Token erhalten")
  }

  setTeacherToken(token)
  return token
}

async function apiRequest(path, options = {}, retry = true) {
  const token = getTeacherToken()

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  let response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  })

  if ((response.status === 401 || response.status === 403) && retry) {
    const newToken = await refreshTeacherToken()

    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      },
      credentials: "include",
    })
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
      } catch {}
    }

    throw new Error(errorMessage || "Request fehlgeschlagen")
  }

  if (response.status === 204) return null

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function loginTeacher(emailAddress, password) {
  const data = await apiRequest(
    "/login",
    {
      method: "POST",
      body: JSON.stringify({ emailAddress, password }),
    },
    false
  )

  const token =
    data?.accessToken ||
    data?.token ||
    data?.jwt ||
    data?.access_token ||
    data?.data?.token

  if (!token) {
    throw new Error("Kein Token in der Login-Antwort gefunden")
  }

  setTeacherToken(token)
  return data
}

export async function logoutTeacher() {
  removeTeacherToken()
}

export async function getTeacherGroups() {
  return apiRequest("/groups", { method: "GET" })
}

export async function createTeacherGroup(classNumber) {
  return apiRequest("/group", {
    method: "POST",
    body: JSON.stringify({ classNumber }),
  })
}

export async function updateTeacherGroup(groupId, classNumber) {
  return apiRequest(`/group/${groupId}`, {
    method: "PATCH",
    body: JSON.stringify({ classNumber }),
  })
}

export async function deleteTeacherGroup(groupId) {
  return apiRequest(`/group/${groupId}`, {
    method: "DELETE",
  })
}

export async function addStudentToGroup(groupId, EMailAddress) {
  return apiRequest(`/groups/${groupId}/students`, {
    method: "POST",
    body: JSON.stringify({ EMailAddress }),
  })
}

export async function removeStudentFromMyGroup(studentId) {
  return apiRequest(`/group/student/${studentId}`, {
    method: "DELETE",
  })
}

export async function getStudentResults() {
  return apiRequest("/results", { method: "GET" })
}
