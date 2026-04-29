const API_BASE_URL = "http://localhost:5000/api/Teacher"
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

async function apiRequest(path, options = {}) {
  const token = getTeacherToken()

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
      } catch {}
    }

    throw new Error(errorMessage || "Request fehlgeschlagen")
  }

  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function loginTeacher(emailAddress, password) {
  const data = await apiRequest("/login", {
    method: "POST",
    body: JSON.stringify({ emailAddress, password }),
  })

  const token =
      data?.token ||
      data?.jwt ||
      data?.accessToken ||
      data?.access_token ||
      data?.data?.token

  if (!token) {
    throw new Error("Kein Token in der Login-Antwort gefunden")
  }

  setTeacherToken(token)
  return data
}

export async function getTeacherGroups() {
  return apiRequest("/groups", {
    method: "GET",
  })
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

export async function addStudentToGroup(groupId, EMailAddress ) {
  return apiRequest(`/groups/${groupId}/students`, {
    method: "POST",
    body: JSON.stringify({ EMailAddress  })  })
}

export async function removeStudentFromMyGroup(studentId) {
  return apiRequest(`/group/student/${studentId}`, {
    method: "DELETE",
  })
}

export async function getStudentResults() {
  return apiRequest("/results", {
    method: "GET",
  })
}