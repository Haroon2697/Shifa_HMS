"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "../header"
import { PatientManagement } from "@/components/modules/patient-management"
import { AppointmentManagement } from "@/components/modules/appointment-management"
import { OPDConsultation } from "@/components/modules/opd-consultation"
import { OTSchedule } from "@/components/modules/ot-schedule"

interface DoctorDashboardProps {
  activeModule: string
  userName: string
  onLogout: () => void
}

export function DoctorDashboard({ activeModule, userName, onLogout }: DoctorDashboardProps) {
  const [appointments] = useState([
    {
      id: 1,
      patientName: "John Doe",
      time: "10:00 AM",
      status: "scheduled",
      type: "consultation",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      time: "11:30 AM",
      status: "completed",
      type: "follow-up",
    },
    {
      id: 3,
      patientName: "Mike Johnson",
      time: "2:00 PM",
      status: "scheduled",
      type: "consultation",
    },
  ])

  const stats = [
    { label: "Today's Appointments", value: "8", color: "bg-blue-500" },
    { label: "Active Patients", value: "12", color: "bg-green-500" },
    { label: "Pending Reports", value: "3", color: "bg-yellow-500" },
    { label: "OT Schedules", value: "2", color: "bg-purple-500" },
  ]

  const renderContent = () => {
    switch (activeModule) {
      case "appointments":
        return <AppointmentManagement />
      case "patients":
        return <PatientManagement />
      case "opd":
        return <OPDConsultation />
      case "ot":
        return <OTSchedule />
      default:
        return <OverviewModule stats={stats} appointments={appointments} />
    }
  }

  return (
    <div>
      <Header title="Doctor Dashboard" userRole="doctor" userName={userName} onLogout={onLogout} />
      {renderContent()}
    </div>
  )
}

function OverviewModule({
  stats,
  appointments,
}: {
  stats: Array<{ label: string; value: string; color: string }>
  appointments: Array<any>
}) {
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
          <h3 className="text-lg font-semibold text-foreground mb-4">Today's Appointments</h3>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div>
                  <p className="text-foreground font-medium">{apt.patientName}</p>
                  <p className="text-slate-400 text-sm">{apt.time}</p>
                </div>
                <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full">{apt.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Pending Tasks</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div>
                  <p className="text-foreground font-medium">Review Report {i}</p>
                  <p className="text-slate-400 text-sm">Due today</p>
                </div>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs">Review</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
