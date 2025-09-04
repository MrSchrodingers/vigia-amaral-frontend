"use client"

import { useState, useEffect } from "react"
import { negotiationsAPI, processesAPI, chatAPI, dashboardAPI } from "../mocks/mock-api"
import type { Negotiation, LegalProcess, ChatSession } from "../mocks/mock-data"

// Hook for negotiations data
export function useNegotiations() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNegotiations = async () => {
      try {
        setLoading(true)
        const data = await negotiationsAPI.getAll()
        setNegotiations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch negotiations")
      } finally {
        setLoading(false)
      }
    }

    fetchNegotiations()
  }, [])

  const sendMessage = async (negotiationId: string, message: string) => {
    try {
      const newMessage = await negotiationsAPI.sendMessage(negotiationId, message)
      // Update local state
      setNegotiations((prev) =>
        prev.map((n) =>
          n.id === negotiationId
            ? { ...n, messages: [...n.messages, newMessage], lastMessage: message, messageCount: n.messageCount + 1 }
            : n,
        ),
      )
      return newMessage
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to send message")
    }
  }

  const generateResume = async (negotiationId: string) => {
    return await negotiationsAPI.generateResume(negotiationId)
  }

  const generateDecisions = async (negotiationId: string) => {
    return await negotiationsAPI.generateDecisions(negotiationId)
  }

  const generateAnalysis = async (negotiationId: string) => {
    return await negotiationsAPI.generateAnalysis(negotiationId)
  }

  return {
    negotiations,
    loading,
    error,
    sendMessage,
    generateResume,
    generateDecisions,
    generateAnalysis,
  }
}

// Hook for legal processes data
export function useProcesses() {
  const [processes, setProcesses] = useState<LegalProcess[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        setLoading(true)
        const data = await processesAPI.getAll()
        setProcesses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch processes")
      } finally {
        setLoading(false)
      }
    }

    fetchProcesses()
  }, [])

  const searchProcesses = async (query: string) => {
    try {
      return await processesAPI.searchByNumber(query)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to search processes")
    }
  }

  const generateResume = async (processId: string) => {
    return await processesAPI.generateResume(processId)
  }

  const generatePDF = async (processId: string) => {
    return await processesAPI.generatePDF(processId)
  }

  const runAIAnalysis = async (processId: string) => {
    return await processesAPI.runAIAnalysis(processId)
  }

  return {
    processes,
    loading,
    error,
    searchProcesses,
    generateResume,
    generatePDF,
    runAIAnalysis,
  }
}

// Hook for chat sessions
export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        const data = await chatAPI.getSessions()
        setSessions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch chat sessions")
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const createSession = async (title?: string) => {
    try {
      const newSession = await chatAPI.createSession(title)
      setSessions((prev) => [newSession, ...prev])
      return newSession
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create session")
    }
  }

  const sendMessage = async (sessionId: string, message: string) => {
    try {
      const response = await chatAPI.sendMessage(sessionId, message)
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, messages: [...s.messages, response], lastActivity: new Date() } : s,
        ),
      )
      return response
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to send message")
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      await chatAPI.deleteSession(sessionId)
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete session")
    }
  }

  return {
    sessions,
    loading,
    error,
    createSession,
    sendMessage,
    deleteSession,
  }
}

// Hook for dashboard statistics
export function useDashboardStats() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await dashboardAPI.getStatistics()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
