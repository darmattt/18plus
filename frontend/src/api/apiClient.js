const API_BASE_URL = "https://localhost:5001/api"

export function getAuthToken() {
  return localStorage.getItem("token")
}

export async function apiFetch(path, options = {}) {
  const token = getAuthToken()

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
    let errorMessage = "API request failed"

    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
    } catch {
      // ignore json parse errors
    }

    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}