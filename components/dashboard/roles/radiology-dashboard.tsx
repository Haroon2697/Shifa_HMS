"use client"

import { Card } from "@/components/ui/card"
import { Header } from "../header"

interface RadiologyDashboardProps {
  activeModule: string
  userName: string
  onLogout: () => void
}

export function RadiologyDashboard({ activeModule, userName, onLogout }: RadiologyDashboardProps) {
  const stats = [
    { label: "Pending Tests", value: "12", color: "bg-blue-500" },
    { label: "Completed Today", value: "28", color: "bg-green-500" },
    { label: "Reports Pending", value: "5", color: "bg-yellow-500" },
    { label: "Equipment Status", value: "Operational", color: "bg-purple-500" },
  ]

  const renderContent = () => {
    switch (activeModule) {
      case "tests":
        return <TestsModule />
      case "reports":
        return <ReportsModule />
      default:
        return <OverviewModule stats={stats} />
    }
  }

  return (
    <div>
      <Header title="Radiology Dashboard" userRole="radiologist" userName={userName} onLogout={onLogout} />
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

      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pending Radiology Tests</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Patient</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Test Type</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Ordered By</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="py-3 px-4 text-foreground">Patient {i}</td>
                  <td className="py-3 px-4 text-foreground">{["X-Ray", "CT Scan", "MRI", "Ultrasound"][i - 1]}</td>
                  <td className="py-3 px-4 text-foreground">Dr. Smith</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-full">Pending</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function TestsModule() {
  return (
    <div>
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Radiology Tests</h3>
        <p className="text-slate-400">Radiology test management will be displayed here</p>
      </Card>
    </div>
  )
}

function ReportsModule() {
  return (
    <div>
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Test Reports</h3>
        <p className="text-slate-400">Test reports will be displayed here</p>
      </Card>
    </div>
  )
}
