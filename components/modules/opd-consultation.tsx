"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface OPDConsultation {
  id: string
  patientName: string
  patientId: string
  doctorName: string
  consultationDate: string
  symptoms: string
  diagnosis: string
  treatmentPlan: string
  medicines: string
  followUpDate: string
  status: "pending" | "completed" | "cancelled"
}

export function OPDConsultation() {
  const [consultations, setConsultations] = useState<OPDConsultation[]>([
    {
      id: "1",
      patientName: "John Doe",
      patientId: "P00001",
      doctorName: "Dr. Smith",
      consultationDate: "2025-10-18",
      symptoms: "Fever, Cough",
      diagnosis: "Common Cold",
      treatmentPlan: "Rest, Fluids, Paracetamol",
      medicines: "Paracetamol 500mg, Cough Syrup",
      followUpDate: "2025-10-25",
      status: "completed",
    },
    {
      id: "2",
      patientName: "Jane Smith",
      patientId: "P00002",
      doctorName: "Dr. Johnson",
      consultationDate: "2025-10-19",
      symptoms: "Shortness of Breath",
      diagnosis: "Asthma Exacerbation",
      treatmentPlan: "Inhaler, Steroids",
      medicines: "Albuterol Inhaler, Prednisone",
      followUpDate: "2025-10-26",
      status: "completed",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    symptoms: "",
    diagnosis: "",
    treatmentPlan: "",
    medicines: "",
    followUpDate: "",
  })

  const handleAddConsultation = (e: React.FormEvent) => {
    e.preventDefault()
    const newConsultation: OPDConsultation = {
      id: String(consultations.length + 1),
      patientName: formData.patientName,
      patientId: `P${String(consultations.length + 1).padStart(5, "0")}`,
      doctorName: formData.doctorName,
      consultationDate: new Date().toISOString().split("T")[0],
      symptoms: formData.symptoms,
      diagnosis: formData.diagnosis,
      treatmentPlan: formData.treatmentPlan,
      medicines: formData.medicines,
      followUpDate: formData.followUpDate,
      status: "completed",
    }
    setConsultations([...consultations, newConsultation])
    setFormData({
      patientName: "",
      doctorName: "",
      symptoms: "",
      diagnosis: "",
      treatmentPlan: "",
      medicines: "",
      followUpDate: "",
    })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">OPD Consultations</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          {showForm ? "Cancel" : "New Consultation"}
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Record OPD Consultation</h3>
          <form onSubmit={handleAddConsultation} className="space-y-4">
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Symptoms</label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  rows={3}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Diagnosis</label>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  rows={3}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Treatment Plan</label>
                <textarea
                  value={formData.treatmentPlan}
                  onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  rows={3}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Prescribed Medicines</label>
                <textarea
                  value={formData.medicines}
                  onChange={(e) => setFormData({ ...formData, medicines: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Follow-up Date</label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">
              Save Consultation
            </Button>
          </form>
        </Card>
      )}

      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <div key={consultation.id} className="border border-slate-700 rounded-lg p-4 hover:bg-slate-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-foreground font-semibold">{consultation.patientName}</p>
                  <p className="text-slate-400 text-sm">ID: {consultation.patientId}</p>
                </div>
                <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">{consultation.status}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Doctor</p>
                  <p className="text-foreground">{consultation.doctorName}</p>
                </div>
                <div>
                  <p className="text-slate-400">Consultation Date</p>
                  <p className="text-foreground">{consultation.consultationDate}</p>
                </div>
                <div>
                  <p className="text-slate-400">Symptoms</p>
                  <p className="text-foreground">{consultation.symptoms}</p>
                </div>
                <div>
                  <p className="text-slate-400">Diagnosis</p>
                  <p className="text-foreground">{consultation.diagnosis}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-slate-400">Treatment Plan</p>
                  <p className="text-foreground">{consultation.treatmentPlan}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-slate-400">Medicines</p>
                  <p className="text-foreground">{consultation.medicines}</p>
                </div>
                <div>
                  <p className="text-slate-400">Follow-up Date</p>
                  <p className="text-foreground">{consultation.followUpDate}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs">Edit</Button>
                <Button className="bg-slate-700 hover:bg-slate-600 text-white text-xs">Print</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
