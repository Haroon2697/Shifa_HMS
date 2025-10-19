"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const ROLES = [
  { value: "admin", label: "Administrator", description: "Full system access" },
  { value: "doctor", label: "Doctor", description: "Patient care & consultations" },
  { value: "nurse", label: "Nurse", description: "Patient care & vital signs" },
  { value: "receptionist", label: "Receptionist", description: "Patient registration & appointments" },
  { value: "radiologist", label: "Radiologist", description: "Imaging tests & reports" },
  { value: "pharmacist", label: "Pharmacist", description: "Medicine inventory & prescriptions" },
  { value: "accountant", label: "Accountant", description: "Billing & invoicing" },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    console.log('=== LOGIN DEBUG START ===')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('Selected Role:', selectedRole)
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    try {
      console.log('Attempting sign in...')
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Auth result:', { authData, signInError })

      if (signInError) {
        console.error('Sign in error:', signInError)
        setError(`Sign in failed: ${signInError.message}`)
        return
      }

      if (authData.user) {
        console.log('User authenticated:', authData.user.id)
        
        // Get user's staff profile to verify role
        console.log('Fetching staff profile...')
        const { data: staffProfile, error: staffError } = await supabase
          .from("staff")
          .select("role, full_name, is_active")
          .eq("id", authData.user.id)
          .single()

        console.log('Staff profile result:', { staffProfile, staffError })

        if (staffError) {
          console.error('Staff profile error:', staffError)
          setError(`Staff profile error: ${staffError.message}`)
          return
        }

        if (!staffProfile) {
          console.error('No staff profile found')
          setError("User profile not found. Please contact administrator.")
          return
        }

        if (!staffProfile.is_active) {
          console.error('Account is inactive')
          setError("Account is deactivated. Please contact administrator.")
          return
        }

        // If role is specified, verify it matches
        if (selectedRole && staffProfile.role !== selectedRole) {
          console.error('Role mismatch:', { selectedRole, actualRole: staffProfile.role })
          setError(`Invalid role. Your account is registered as ${staffProfile.role}.`)
          return
        }

        console.log('Login successful, redirecting to dashboard...')
        // Redirect to dashboard with role-based access
        router.push("/dashboard")
      } else {
        console.error('No user data returned')
        setError("Authentication failed. No user data returned.")
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(`An unexpected error occurred: ${err}`)
    } finally {
      setIsLoading(false)
      console.log('=== LOGIN DEBUG END ===')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-cyan-400 mb-2">HMS</h1>
            <p className="text-slate-400">Hospital Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-slate-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <Label className="text-slate-300 mb-3 block">
                Select Your Role (Optional)
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(selectedRole === role.value ? "" : role.value)}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      selectedRole === role.value
                        ? "bg-cyan-500 text-white border-2 border-cyan-400"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-transparent"
                    }`}
                  >
                    <div className="font-medium">{role.label}</div>
                    <div className="text-xs opacity-75">{role.description}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Leave empty to login with any role, or select specific role for verification
              </p>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
