"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "../header"

interface ReceptionistDashboardProps {
  activeModule: string
  userName: string
  onLogout: () => void
}

export function ReceptionistDashboard({ activeModule, userName, onLogout }: ReceptionistDashboardProps) {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)

  const stats = [
    { label: "New Registrations", value: "15", color: "bg-blue-500" },
    { label: "Today's Appointments", value: "24", color: "bg-green-500" },
    { label: "Emergency Cases", value: "2", color: "bg-red-500" },
    { label: "Pending Admissions", value: "5", color: "bg-orange-500" },
  ]

  const renderContent = () => {
    switch (activeModule) {
      case "registration":
        return <RegistrationModule showForm={showRegistrationForm} setShowForm={setShowRegistrationForm} />
      case "appointments":
        return <AppointmentsModule />
      case "emergency":
        return <EmergencyModule />
      default:
        return <OverviewModule stats={stats} />
    }
  }

  return (
    <div>
      <Header title="Receptionist Dashboard" userRole="receptionist" userName={userName} onLogout={onLogout} />
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
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Registrations</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div>
                  <p className="text-foreground font-medium">Patient {i}</p>
                  <p className="text-slate-400 text-sm">Registered today</p>
                </div>
                <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">Active</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Emergency Queue</h3>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div>
                  <p className="text-foreground font-medium">Emergency Case {i}</p>
                  <p className="text-slate-400 text-sm">Severity: High</p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white text-xs">Assign</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function RegistrationModule({ showForm, setShowForm }: { showForm: boolean; setShowForm: (show: boolean) => void }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    bloodGroup: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Patient registered:", formData)
    setFormData({ firstName: "", lastName: "", email: "", phone: "", dob: "", bloodGroup: "" })
    setShowForm(false)
  }

  return (
    <div>
      <div className="mb-6">
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
        >
          {showForm ? "Cancel" : "Register New Patient"}
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Patient Registration Form</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full">
              Register Patient
            </Button>
          </form>
        </Card>
      )}

      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Registrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Patient ID</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Phone</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="py-3 px-4 text-foreground">P{String(i).padStart(5, "0")}</td>
                  <td className="py-3 px-4 text-foreground">Patient {i}</td>
                  <td className="py-3 px-4 text-foreground">patient{i}@email.com</td>
                  <td className="py-3 px-4 text-foreground">+1-555-000{i}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">Active</span>
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

function AppointmentsModule() {
  return (
    <div>
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Manage Appointments</h3>
        <p className="text-slate-400">Appointment management interface will be displayed here</p>
      </Card>
    </div>
  )
}

function EmergencyModule() {
  return (
    <div>
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Emergency Cases</h3>
        <p className="text-slate-400">Emergency case management will be displayed here</p>
      </Card>
    </div>
  )
}
