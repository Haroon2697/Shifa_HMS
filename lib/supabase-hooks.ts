"use client"

import { useEffect, useState } from "react"
import { createClient } from "./supabase/client"
import type { User } from "@supabase/supabase-js"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error) throw error
        setUser(user)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to get user"))
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  return { user, isLoading, error }
}

export function useStaffProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    const getProfile = async () => {
      try {
        const { data, error } = await supabase.from("staff").select("*").eq("id", userId).single()

        if (error) throw error
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to get profile"))
      } finally {
        setIsLoading(false)
      }
    }

    getProfile()
  }, [userId])

  return { profile, isLoading, error }
}

export function useAppointments(doctorId: string | undefined) {
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!doctorId) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    const getAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("*, patients(*)")
          .eq("doctor_id", doctorId)
          .order("appointment_date", { ascending: true })

        if (error) throw error
        setAppointments(data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to get appointments"))
      } finally {
        setIsLoading(false)
      }
    }

    getAppointments()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel(`appointments:${doctorId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `doctor_id=eq.${doctorId}`,
        },
        () => {
          getAppointments()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [doctorId])

  return { appointments, isLoading, error }
}

export function usePatients() {
  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const getPatients = async () => {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })

        if (error) throw error
        setPatients(data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to get patients"))
      } finally {
        setIsLoading(false)
      }
    }

    getPatients()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("patients")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "patients",
        },
        () => {
          getPatients()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { patients, isLoading, error }
}
