import { useCallback, useEffect, useRef, useState } from "react"

import { getWorksheetResult, saveWorksheetResult } from "@/api/studentApi"

const SAVE_DEBOUNCE_MS = 800

// WorkingStatus enum from the backend, serialized as its name (Draft/InProgress/Submitted/Cancelled)
const SUBMITTED_STATUS = "Submitted"

export function useWorksheetProgress(worksheetId) {
  const [initialAnswers, setInitialAnswers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setInitialAnswers(null)
    setSubmitted(false)

    async function loadResult() {
      try {
        const data = await getWorksheetResult(worksheetId)
        if (cancelled) return

        setInitialAnswers(data?.answersJson ? JSON.parse(data.answersJson) : null)
        setSubmitted(data?.status === SUBMITTED_STATUS)
      } catch (error) {
        console.error("Failed to load worksheet progress", error)
        if (!cancelled) setInitialAnswers(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadResult()

    return () => {
      cancelled = true
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [worksheetId])

  const saveAnswers = useCallback(
    (answers, submit = false) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)

      debounceRef.current = setTimeout(() => {
        saveWorksheetResult(worksheetId, JSON.stringify(answers), submit).catch((error) => {
          console.error("Failed to save worksheet progress", error)
        })
      }, SAVE_DEBOUNCE_MS)
    },
    [worksheetId]
  )

  const submitAnswers = useCallback(
    async (answers) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)

      try {
        await saveWorksheetResult(worksheetId, JSON.stringify(answers), true)
        setSubmitted(true)
        return true
      } catch (error) {
        console.error("Failed to submit worksheet", error)
        return false
      }
    },
    [worksheetId]
  )

  return { initialAnswers, loading, saveAnswers, submitAnswers, submitted }
}
