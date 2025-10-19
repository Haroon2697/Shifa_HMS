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

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [department, setDepartment] = useState("")
  const [phone, setPhone] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!selectedRole) {
      setError("Please select a role")
      return
    }

    setIsLoading(true)

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            role: selectedRole,
            department: department,
            specialization: specialization,
            license_number: licenseNumber,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (authData.user) {
        // Create staff profile manually (in case trigger is not set up)
        try {
          const { error: staffError } = await supabase
            .from("staff")
            .insert({
              id: authData.user.id,
              email: email,
              full_name: fullName,
              role: selectedRole,
              department: department || 'General',
              phone: phone,
              specialization: specialization,
              license_number: licenseNumber,
              is_active: true,
              profile_completed: false
            })

          if (staffError && staffError.code !== '23505') { // Ignore duplicate key error (trigger already created it)
            console.error('Staff profile creation error:', staffError)
          }
        } catch (err) {
          console.error('Error creating staff profile:', err)
        }

        router.push("/auth/signup-success")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-cyan-400 mb-2">HMS</h1>
            <p className="text-slate-400">Create Staff Account</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="text-slate-300">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="John Doe"
                required
              />
            </div>

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
              <Label htmlFor="phone" className="text-slate-300">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label className="text-slate-300 mb-3 block">
                Select Your Role *
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
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
            </div>

            <div>
              <Label htmlFor="department" className="text-slate-300">
                Department
              </Label>
              <Input
                id="department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="e.g., Cardiology, ICU, Administration"
              />
            </div>

            {(selectedRole === "doctor" || selectedRole === "radiologist") && (
              <div>
                <Label htmlFor="specialization" className="text-slate-300">
                  Specialization
                </Label>
                <Input
                  id="specialization"
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  placeholder="e.g., Cardiologist, Diagnostic Radiology"
                />
              </div>
            )}

            {(selectedRole === "doctor" || selectedRole === "radiologist" || selectedRole === "pharmacist") && (
              <div>
                <Label htmlFor="licenseNumber" className="text-slate-300">
                  License Number
                </Label>
                <Input
                  id="licenseNumber"
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  placeholder="e.g., MD12345, RAD67890"
                />
              </div>
            )}

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
              <Label htmlFor="confirmPassword" className="text-slate-300">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
