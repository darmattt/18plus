const API_BASE_URL = "http://localhost:5000/api/Student"

async function apiRequest(path, options = {}) {
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
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

export async function requestStudentLoginCode(emailAddress) {
  return apiRequest("/login/request-code", {
    method: "POST",
    body: JSON.stringify({
      EmailAddress: emailAddress,
    }),
  })
}

export async function verifyStudentLoginCode(emailAddress, oneTimeCode) {
  return apiRequest("/login/verify-code", {
    method: "POST",
    body: JSON.stringify({
      EmailAddress: emailAddress,
      OneTimeCode: oneTimeCode,
    }),
  })
}
