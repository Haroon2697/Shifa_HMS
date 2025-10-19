"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface OTSchedule {
  id: string
  patientName: string
  patientId: string
  surgeonName: string
  anesthetistName: string
  operationType: string
  operationDate: string
  operationTime: string
  estimatedDuration: number
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  preOpNotes: string
  postOpNotes: string
}

export function OTSchedule() {
  const [schedules, setSchedules] = useState<OTSchedule[]>([
    {
      id: "1",
      patientName: "John Doe",
      patientId: "P00001",
      surgeonName: "Dr. Smith",
      anesthetistName: "Dr. Brown",
      operationType: "Appendectomy",
      operationDate: "2025-10-22",
      operationTime: "09:00 AM",
      estimatedDuration: 60,
      status: "scheduled",
      preOpNotes: "Patient fasting since midnight",
      postOpNotes: "",
    },
    {
      id: "2",
      patientName: "Jane Smith",
      patientId: "P00002",
      surgeonName: "Dr. Johnson",
      anesthetistName: "Dr. Wilson",
      operationType: "Cataract Surgery",
      operationDate: "2025-10-21",
      operationTime: "02:00 PM",
      estimatedDuration: 45,
      status: "completed",
      preOpNotes: "Local anesthesia",
      postOpNotes: "Surgery successful, patient stable",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    surgeonName: "",
    anesthetistName: "",
    operationType: "",
    operationDate: "",
    operationTime: "",
    estimatedDuration: "",
    preOpNotes: "",
  })

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault()
    const newSchedule: OTSchedule = {
      id: String(schedules.length + 1),
      patientName: formData.patientName,
      patientId: `P${String(schedules.length + 1).padStart(5, "0")}`,
      surgeonName: formData.surgeonName,
      anesthetistName: formData.anesthetistName,
      operationType: formData.operationType,
      operationDate: formData.operationDate,
      operationTime: formData.operationTime,
      estimatedDuration: Number.parseInt(formData.estimatedDuration),
      status: "scheduled",
      preOpNotes: formData.preOpNotes,
      postOpNotes: "",
    }
    setSchedules([...schedules, newSchedule])
    setFormData({
      patientName: "",
      surgeonName: "",
      anesthetistName: "",
      operationType: "",
      operationDate: "",
      operationTime: "",
      estimatedDuration: "",
      preOpNotes: "",
    })
    setShowForm(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500"
      case "in-progress":
        return "bg-yellow-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">OT Schedule</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          {showForm ? "Cancel" : "Schedule Surgery"}
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Schedule New Surgery</h3>
          <form onSubmit={handleAddSchedule} className="space-y-4">
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
                <label className="block text-sm font-medium text-slate-300 mb-2">Operation Type</label>
                <input
                  type="text"
                  value={formData.operationType}
                  onChange={(e) => setFormData({ ...formData, operationType: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Surgeon Name</label>
                <input
                  type="text"
                  value={formData.surgeonName}
                  onChange={(e) => setFormData({ ...formData, surgeonName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Anesthetist Name</label>
                <input
                  type="text"
                  value={formData.anesthetistName}
                  onChange={(e) => setFormData({ ...formData, anesthetistName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Operation Date</label>
                <input
                  type="date"
                  value={formData.operationDate}
                  onChange={(e) => setFormData({ ...formData, operationDate: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Operation Time</label>
                <input
                  type="time"
                  value={formData.operationTime}
                  onChange={(e) => setFormData({ ...formData, operationTime: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Estimated Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Pre-Op Notes</label>
                <textarea
                  value={formData.preOpNotes}
                  onChange={(e) => setFormData({ ...formData, preOpNotes: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  rows={3}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">
              Schedule Surgery
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
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Operation Type</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Surgeon</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Date & Time</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Duration</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="py-3 px-4 text-foreground">{schedule.patientName}</td>
                  <td className="py-3 px-4 text-foreground">{schedule.operationType}</td>
                  <td className="py-3 px-4 text-foreground">{schedule.surgeonName}</td>
                  <td className="py-3 px-4 text-foreground">
                    {schedule.operationDate} {schedule.operationTime}
                  </td>
                  <td className="py-3 px-4 text-foreground">{schedule.estimatedDuration} min</td>
                  <td className="py-3 px-4">
                    <span className={`${getStatusColor(schedule.status)} px-3 py-1 text-white text-xs rounded-full`}>
                      {schedule.status}
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
