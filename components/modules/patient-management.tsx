"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Patient {
  id: string
  patientId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string
  bloodGroup: string
  gender: string
  address: string
  medicalHistory: string
  allergies: string
  status: "active" | "inactive"
}

export function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      patientId: "P00001",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1-555-0001",
      dob: "1990-05-15",
      bloodGroup: "O+",
      gender: "Male",
      address: "123 Main St, City",
      medicalHistory: "Hypertension, Diabetes",
      allergies: "Penicillin",
      status: "active",
    },
    {
      id: "2",
      patientId: "P00002",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "+1-555-0002",
      dob: "1985-08-22",
      bloodGroup: "A+",
      gender: "Female",
      address: "456 Oak Ave, City",
      medicalHistory: "Asthma",
      allergies: "Aspirin",
      status: "active",
    },
    {
      id: "3",
      patientId: "P00003",
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike@example.com",
      phone: "+1-555-0003",
      dob: "1992-03-10",
      bloodGroup: "B+",
      gender: "Male",
      address: "789 Pine Rd, City",
      medicalHistory: "None",
      allergies: "None",
      status: "active",
    },
  ])

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Patient Management</h2>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">Add New Patient</Button>
      </div>

      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Patient ID</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Phone</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Blood Group</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="py-3 px-4 text-foreground font-medium">{patient.patientId}</td>
                  <td className="py-3 px-4 text-foreground">
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td className="py-3 px-4 text-foreground">{patient.email}</td>
                  <td className="py-3 px-4 text-foreground">{patient.phone}</td>
                  <td className="py-3 px-4 text-foreground">{patient.bloodGroup}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">{patient.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        setSelectedPatient(patient)
                        setShowDetails(true)
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showDetails && selectedPatient && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-foreground">Patient Details</h3>
            <button onClick={() => setShowDetails(false)} className="text-slate-400 hover:text-foreground text-2xl">
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-400 text-sm">First Name</p>
              <p className="text-foreground font-medium">{selectedPatient.firstName}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Last Name</p>
              <p className="text-foreground font-medium">{selectedPatient.lastName}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Date of Birth</p>
              <p className="text-foreground font-medium">{selectedPatient.dob}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Gender</p>
              <p className="text-foreground font-medium">{selectedPatient.gender}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Blood Group</p>
              <p className="text-foreground font-medium">{selectedPatient.bloodGroup}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Email</p>
              <p className="text-foreground font-medium">{selectedPatient.email}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Phone</p>
              <p className="text-foreground font-medium">{selectedPatient.phone}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Address</p>
              <p className="text-foreground font-medium">{selectedPatient.address}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-slate-400 text-sm">Medical History</p>
              <p className="text-foreground font-medium">{selectedPatient.medicalHistory}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-slate-400 text-sm">Allergies</p>
              <p className="text-foreground font-medium">{selectedPatient.allergies}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">Edit Patient</Button>
            <Button className="bg-slate-700 hover:bg-slate-600 text-white">Print Record</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
