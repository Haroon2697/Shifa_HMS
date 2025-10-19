"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EmergencyCase {
  id: string
  caseNumber: string
  patientName: string
  patientId: string
  arrivalTime: string
  chiefComplaint: string
  severityLevel: "critical" | "high" | "moderate" | "low"
  assignedDoctor: string
  status: "active" | "admitted" | "discharged" | "transferred"
  notes: string
}

export function EmergencyCases() {
  const [cases, setCases] = useState<EmergencyCase[]>([
    {
      id: "1",
      caseNumber: "EM-001",
      patientName: "John Doe",
      patientId: "P00001",
      arrivalTime: "2025-10-20 08:30",
      chiefComplaint: "Chest Pain",
      severityLevel: "critical",
      assignedDoctor: "Dr. Smith",
      status: "admitted",
      notes: "Possible cardiac event, admitted to ICU",
    },
    {
      id: "2",
      caseNumber: "EM-002",
      patientName: "Jane Smith",
      patientId: "P00002",
      arrivalTime: "2025-10-20 09:15",
      chiefComplaint: "Head Injury",
      severityLevel: "high",
      assignedDoctor: "Dr. Johnson",
      status: "active",
      notes: "CT scan ordered, under observation",
    },
    {
      id: "3",
      caseNumber: "EM-003",
      patientName: "Mike Johnson",
      patientId: "P00003",
      arrivalTime: "2025-10-20 10:00",
      chiefComplaint: "Fracture",
      severityLevel: "moderate",
      assignedDoctor: "Dr. Williams",
      status: "active",
      notes: "X-ray completed, orthopedic consultation pending",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    chiefComplaint: "",
    severityLevel: "moderate" as const,
    assignedDoctor: "",
    notes: "",
  })

  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault()
    const newCase: EmergencyCase = {
      id: String(cases.length + 1),
      caseNumber: `EM-${String(cases.length + 1).padStart(3, "0")}`,
      patientName: formData.patientName,
      patientId: `P${String(cases.length + 1).padStart(5, "0")}`,
      arrivalTime: new Date().toLocaleString(),
      chiefComplaint: formData.chiefComplaint,
      severityLevel: formData.severityLevel,
      assignedDoctor: formData.assignedDoctor,
      status: "active",
      notes: formData.notes,
    }
    setCases([...cases, newCase])
    setFormData({
      patientName: "",
      chiefComplaint: "",
      severityLevel: "moderate",
      assignedDoctor: "",
      notes: "",
    })
    setShowForm(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600"
      case "high":
        return "bg-red-500"
      case "moderate":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500"
      case "admitted":
        return "bg-purple-500"
      case "discharged":
        return "bg-green-500"
      case "transferred":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Emergency Cases</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-red-600 hover:bg-red-700 text-white">
          {showForm ? "Cancel" : "Register Emergency"}
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Register Emergency Case</h3>
          <form onSubmit={handleAddCase} className="space-y-4">
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
                <label className="block text-sm font-medium text-slate-300 mb-2">Chief Complaint</label>
                <input
                  type="text"
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Severity Level</label>
                <select
                  value={formData.severityLevel}
                  onChange={(e) => setFormData({ ...formData, severityLevel: e.target.value as any })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="moderate">Moderate</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Assigned Doctor</label>
                <input
                  type="text"
                  value={formData.assignedDoctor}
                  onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  rows={3}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">
              Register Case
            </Button>
          </form>
        </Card>
      )}

      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="space-y-4">
          {cases.map((emergencyCase) => (
            <div key={emergencyCase.id} className="border border-slate-700 rounded-lg p-4 hover:bg-slate-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-foreground font-semibold">{emergencyCase.caseNumber}</p>
                  <p className="text-slate-400 text-sm">{emergencyCase.patientName}</p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`${getSeverityColor(emergencyCase.severityLevel)} px-3 py-1 text-white text-xs rounded-full`}
                  >
                    {emergencyCase.severityLevel}
                  </span>
                  <span className={`${getStatusColor(emergencyCase.status)} px-3 py-1 text-white text-xs rounded-full`}>
                    {emergencyCase.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p className="text-slate-400">Arrival Time</p>
                  <p className="text-foreground">{emergencyCase.arrivalTime}</p>
                </div>
                <div>
                  <p className="text-slate-400">Chief Complaint</p>
                  <p className="text-foreground">{emergencyCase.chiefComplaint}</p>
                </div>
                <div>
                  <p className="text-slate-400">Assigned Doctor</p>
                  <p className="text-foreground">{emergencyCase.assignedDoctor}</p>
                </div>
                <div>
                  <p className="text-slate-400">Notes</p>
                  <p className="text-foreground">{emergencyCase.notes}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs">Update Status</Button>
                <Button className="bg-slate-700 hover:bg-slate-600 text-white text-xs">View Details</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
