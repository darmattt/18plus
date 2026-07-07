import { useCallback, useContext, useEffect, useRef, useState } from "react"

import { getWorksheetResult, saveWorksheetResult } from "@/api/studentApi"
import { WorksheetFlowContext } from "@/context/WorksheetFlowContext"

const SAVE_DEBOUNCE_MS = 800

// WorkingStatus enum from the backend, serialized as its name (Draft/InProgress/Submitted/Cancelled)
const SUBMITTED_STATUS = "Submitted"

export function useWorksheetProgress(worksheetId) {
  const { onWorksheetSubmitted } = useContext(WorksheetFlowContext)
  const [initialAnswers, setInitialAnswers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setInitialAnswers(null)
    setSubmitted(false)
    setSubmitting(false)
    setSubmitError(null)

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
        setSubmitError(null)
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
      setSubmitError(null)
      setSubmitting(true)

      try {
        const result = await saveWorksheetResult(worksheetId, JSON.stringify(answers), true)
        setSubmitted(result?.status ? result.status === SUBMITTED_STATUS : true)
        onWorksheetSubmitted?.(worksheetId)
        return true
      } catch (error) {
        console.error("Failed to submit worksheet", error)
        const message =
          error?.message || "Das Arbeitsblatt konnte nicht abgeschlossen werden."
        setSubmitError(message)
        window.alert(message)
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [onWorksheetSubmitted, worksheetId]
  )

  return {
    initialAnswers,
    loading,
    saveAnswers,
    submitAnswers,
    submitted,
    submitting,
    submitError,
  }
}
