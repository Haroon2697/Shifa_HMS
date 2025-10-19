"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RadiologyTest {
  id: string
  patientName: string
  patientId: string
  testType: "X-Ray" | "CT Scan" | "MRI" | "Ultrasound" | "ECG"
  orderedByDoctor: string
  testDate: string
  status: "pending" | "completed" | "reported"
  findings: string
  radiologistName: string
}

export function RadiologyTests() {
  const [tests, setTests] = useState<RadiologyTest[]>([
    {
      id: "1",
      patientName: "John Doe",
      patientId: "P00001",
      testType: "X-Ray",
      orderedByDoctor: "Dr. Smith",
      testDate: "2025-10-18",
      status: "completed",
      findings: "No abnormalities detected",
      radiologistName: "Dr. Patel",
    },
    {
      id: "2",
      patientName: "Jane Smith",
      patientId: "P00002",
      testType: "CT Scan",
      orderedByDoctor: "Dr. Johnson",
      testDate: "2025-10-19",
      status: "reported",
      findings: "Mild inflammation in lungs",
      radiologistName: "Dr. Kumar",
    },
    {
      id: "3",
      patientName: "Mike Johnson",
      patientId: "P00003",
      testType: "Ultrasound",
      orderedByDoctor: "Dr. Williams",
      testDate: "2025-10-20",
      status: "pending",
      findings: "",
      radiologistName: "",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    testType: "X-Ray" as const,
    orderedByDoctor: "",
    testDate: "",
    findings: "",
    radiologistName: "",
  })

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault()
    const newTest: RadiologyTest = {
      id: String(tests.length + 1),
      patientName: formData.patientName,
      patientId: `P${String(tests.length + 1).padStart(5, "0")}`,
      testType: formData.testType,
      orderedByDoctor: formData.orderedByDoctor,
      testDate: formData.testDate,
      status: formData.findings ? "reported" : "pending",
      findings: formData.findings,
      radiologistName: formData.radiologistName,
    }
    setTests([...tests, newTest])
    setFormData({
      patientName: "",
      testType: "X-Ray",
      orderedByDoctor: "",
      testDate: "",
      findings: "",
      radiologistName: "",
    })
    setShowForm(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "completed":
        return "bg-blue-500"
      case "reported":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Radiology Tests</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          {showForm ? "Cancel" : "Order Test"}
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Order Radiology Test</h3>
          <form onSubmit={handleAddTest} className="space-y-4">
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
                <label className="block text-sm font-medium text-slate-300 mb-2">Test Type</label>
                <select
                  value={formData.testType}
                  onChange={(e) => setFormData({ ...formData, testType: e.target.value as any })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="X-Ray">X-Ray</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="MRI">MRI</option>
                  <option value="Ultrasound">Ultrasound</option>
                  <option value="ECG">ECG</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Ordered By Doctor</label>
                <input
                  type="text"
                  value={formData.orderedByDoctor}
                  onChange={(e) => setFormData({ ...formData, orderedByDoctor: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Test Date</label>
                <input
                  type="date"
                  value={formData.testDate}
                  onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Radiologist Name</label>
                <input
                  type="text"
                  value={formData.radiologistName}
                  onChange={(e) => setFormData({ ...formData, radiologistName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Findings</label>
                <textarea
                  value={formData.findings}
                  onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  rows={3}
                />
              </div>
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">
              Save Test
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
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Test Type</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Ordered By</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Test Date</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Radiologist</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="py-3 px-4 text-foreground">{test.patientName}</td>
                  <td className="py-3 px-4 text-foreground">{test.testType}</td>
                  <td className="py-3 px-4 text-foreground">{test.orderedByDoctor}</td>
                  <td className="py-3 px-4 text-foreground">{test.testDate}</td>
                  <td className="py-3 px-4 text-foreground">{test.radiologistName || "-"}</td>
                  <td className="py-3 px-4">
                    <span className={`${getStatusColor(test.status)} px-3 py-1 text-white text-xs rounded-full`}>
                      {test.status}
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
