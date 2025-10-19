"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { DoctorDashboard } from "./roles/doctor-dashboard"
import { ReceptionistDashboard } from "./roles/receptionist-dashboard"
import { AdminDashboard } from "./roles/admin-dashboard"
import { AccountantDashboard } from "./roles/accountant-dashboard"
import { RadiologyDashboard } from "./roles/radiology-dashboard"

interface DashboardProps {
  userRole: string
  userName: string
  onLogout: () => Promise<void>
}

export function Dashboard({ userRole, userName, onLogout }: DashboardProps) {
  const [activeModule, setActiveModule] = useState("overview")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await onLogout()
    } catch (error) {
      console.error("Logout error:", error)
      setIsLoggingOut(false)
    }
  }

  const renderDashboard = () => {
    console.log("Rendering dashboard for role:", userRole)
    
    switch (userRole) {
      case "admin":
        return <AdminDashboard activeModule={activeModule} userName={userName} onLogout={handleLogout} />
      case "doctor":
        return <DoctorDashboard activeModule={activeModule} userName={userName} onLogout={handleLogout} />
      case "receptionist":
        return <ReceptionistDashboard activeModule={activeModule} userName={userName} onLogout={handleLogout} />
      case "accountant":
        return <AccountantDashboard activeModule={activeModule} userName={userName} onLogout={handleLogout} />
      case "radiologist":
        return <RadiologyDashboard activeModule={activeModule} userName={userName} onLogout={handleLogout} />
      default:
        console.log("Unknown role, defaulting to admin dashboard")
        return <AdminDashboard activeModule={activeModule} userName={userName} onLogout={handleLogout} />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={userRole} activeModule={activeModule} onModuleChange={setActiveModule} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{renderDashboard()}</div>
      </main>
    </div>
  )
}
