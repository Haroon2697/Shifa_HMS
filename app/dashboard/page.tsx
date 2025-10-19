import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Dashboard } from "@/components/dashboard/dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Try to get staff profile, but handle RLS errors gracefully
  let staffProfile = null
  let staffError = null
  
  try {
    const result = await supabase.from("staff").select("*").eq("id", user.id).single()
    staffProfile = result.data
    staffError = result.error
  } catch (error) {
    console.error("Error fetching staff profile:", error)
    staffError = error
  }

  // Debug logging
  console.log("User ID:", user.id)
  console.log("Staff Profile:", staffProfile)
  console.log("Staff Error:", staffError)

  // If staff profile not found or RLS error, use defaults
  let userRole = staffProfile?.role || "admin" // Default to admin if not found
  let userName = staffProfile?.full_name || user.email?.split("@")[0] || "User"

  // If no staff profile found and no RLS error, try to create one
  if (!staffProfile && !staffError) {
    console.log("No staff profile found, creating basic admin profile")
    try {
      const { error: insertError } = await supabase
        .from("staff")
        .insert({
          id: user.id,
          email: user.email || "",
          full_name: user.email?.split("@")[0] || "Admin User",
          role: "admin",
          department: "Administration",
          is_active: true
        })
      
      if (insertError) {
        console.error("Error creating staff profile:", insertError)
      } else {
        userRole = "admin"
        userName = user.email?.split("@")[0] || "Admin User"
      }
    } catch (error) {
      console.error("Error creating staff profile:", error)
    }
  }

  // Debug logging
  console.log("Final User Role:", userRole)
  console.log("Final User Name:", userName)

  const handleLogout = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return <Dashboard userRole={userRole} userName={userName} onLogout={handleLogout} />
}
