"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Appointment {
  id: string
  patientName: string
  patientId: string
  doctorName: string
  date: string
  time: string
  type: "consultation" | "follow-up" | "emergency"
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  reason: string
}

export function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "John Doe",
      patientId: "P00001",
      doctorName: "Dr. Smith",
      date: "2025-10-20",
      time: "10:00 AM",
      type: "consultation",
      status: "scheduled",
      reason: "General Checkup",
    },
    {
      id: "2",
      patientName: "Jane Smith",
      patientId: "P00002",
      doctorName: "Dr. Johnson",
      date: "2025-10-20",
      time: "11:30 AM",
      type: "follow-up",
      status: "scheduled",
      reason: "Follow-up Asthma",
    },
    {
      id: "3",
      patientName: "Mike Johnson",
      patientId: "P00003",
      doctorName: "Dr. Williams",
      date: "2025-10-19",
      time: "2:00 PM",
      type: "consultation",
      status: "completed",
      reason: "Chest Pain",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    date: "",
    time: "",
    type: "consultation" as const,
    reason: "",
  })

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    const newAppointment: Appointment = {
      id: String(appointments.length + 1),
      patientName: formData.patientName,
      patientId: `P${String(appointments.length + 1).padStart(5, "0")}`,
      doctorName: formData.doctorName,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      status: "scheduled",
      reason: formData.reason,
    }
    setAppointments([...appointments, newAppointment])
    setFormData({ patientName: "", doctorName: "", date: "", time: "", type: "consultation", reason: "" })
    setShowForm(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      case "no-show":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Appointment Management</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          {showForm ? "Cancel" : "Schedule Appointment"}
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Schedule New Appointment</h3>
          <form onSubmit={handleAddAppointment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Patient Name</label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Doctor Name</label>
                <input
                  type="text"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Appointment Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Reason for Visit</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">
              Schedule Appointment
            </Button>
          </form>
        </Card>
      )}

      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Patient</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Doctor</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Date & Time</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Reason</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="py-3 px-4 text-foreground">{apt.patientName}</td>
                  <td className="py-3 px-4 text-foreground">{apt.doctorName}</td>
                  <td className="py-3 px-4 text-foreground">
                    {apt.date} {apt.time}
                  </td>
                  <td className="py-3 px-4 text-foreground capitalize">{apt.type}</td>
                  <td className="py-3 px-4 text-foreground">{apt.reason}</td>
                  <td className="py-3 px-4">
                    <span className={`${getStatusColor(apt.status)} px-3 py-1 text-white text-xs rounded-full`}>
                      {apt.status}
                    </span>
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
