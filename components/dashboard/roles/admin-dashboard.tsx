"use client"

import { Card } from "@/components/ui/card"
import { Header } from "../header"
import { RoomManagement } from "@/components/modules/room-management"
import { BillingManagement } from "@/components/modules/billing-management"

interface AdminDashboardProps {
  activeModule: string
  userName: string
  onLogout: () => void
}

export function AdminDashboard({ activeModule, userName, onLogout }: AdminDashboardProps) {
  const stats = [
    { label: "Total Patients", value: "1,245", color: "bg-blue-500" },
    { label: "Active Staff", value: "87", color: "bg-green-500" },
    { label: "Occupied Beds", value: "156/200", color: "bg-yellow-500" },
    { label: "Monthly Revenue", value: "$45.2K", color: "bg-purple-500" },
  ]

  const renderContent = () => {
    switch (activeModule) {
      case "users":
        return <UsersModule />
      case "patients":
        return <PatientsModule />
      case "rooms":
        return <RoomManagement />
      case "billing":
        return <BillingManagement />
      case "reports":
        return <ReportsModule />
      default:
        return <OverviewModule stats={stats} />
    }
  }

  return (
    <div>
      <Header title="Admin Dashboard" userRole="admin" userName={userName} onLogout={onLogout} />
      {renderContent()}
    </div>
  )
}

function OverviewModule({ stats }: { stats: Array<{ label: string; value: string; color: string }> }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} className="bg-slate-800 border-slate-700 p-6">
            <div className={`${stat.color} w-12 h-12 rounded-lg mb-4`}></div>
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Database Status</span>
              <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">API Status</span>
              <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Backup Status</span>
              <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">Up to date</span>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-sm">
                <p className="text-foreground">Activity {i}</p>
                <p className="text-slate-400 text-xs">2 hours ago</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function UsersModule() {
  return (
    <div>
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Users & Staff Management</h3>
        <p className="text-slate-400">Staff management interface will be displayed here</p>
      </Card>
    </div>
  )
}

function PatientsModule() {
  return (
    <div>
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Patient Management</h3>
        <p className="text-slate-400">Patient management interface will be displayed here</p>
      </Card>
    </div>
  )
}

function ReportsModule() {
  return (
    <div>
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">System Reports</h3>
        <p className="text-slate-400">Reports will be displayed here</p>
      </Card>
    </div>
  )
}
