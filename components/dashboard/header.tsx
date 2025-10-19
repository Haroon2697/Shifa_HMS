"use client"

import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
  userRole: string
  userName: string
  onLogout: () => void
}

export function Header({ title, userRole, userName, onLogout }: HeaderProps) {
  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-purple-500",
      doctor: "bg-blue-500",
      receptionist: "bg-green-500",
      accountant: "bg-yellow-500",
      radiologist: "bg-pink-500",
      nurse: "bg-indigo-500",
    }
    return colors[role] || "bg-gray-500"
  }

  return (
    <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back, {userName}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`${getRoleColor(userRole)} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold`}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{userName}</p>
            <p className="text-xs text-slate-400 capitalize">{userRole}</p>
          </div>
        </div>
        <Button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white">
          Logout
        </Button>
      </div>
    </div>
  )
}
