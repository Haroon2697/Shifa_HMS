"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Invoice {
  id: string
  invoiceNumber: string
  patientName: string
  patientId: string
  invoiceDate: string
  totalAmount: number
  discountAmount: number
  taxAmount: number
  netAmount: number
  paymentStatus: "pending" | "partial" | "paid" | "cancelled"
  paymentMethod: string
  items: Array<{ description: string; quantity: number; unitPrice: number; totalPrice: number }>
}

export function BillingManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-00001",
      patientName: "John Doe",
      patientId: "P00001",
      invoiceDate: "2025-10-18",
      totalAmount: 2500,
      discountAmount: 250,
      taxAmount: 225,
      netAmount: 2475,
      paymentStatus: "paid",
      paymentMethod: "Credit Card",
      items: [
        { description: "Room Charges (3 days)", quantity: 3, unitPrice: 500, totalPrice: 1500 },
        { description: "Consultation", quantity: 1, unitPrice: 500, totalPrice: 500 },
        { description: "Lab Tests", quantity: 1, unitPrice: 500, totalPrice: 500 },
      ],
    },
    {
      id: "2",
      invoiceNumber: "INV-00002",
      patientName: "Jane Smith",
      patientId: "P00002",
      invoiceDate: "2025-10-19",
      totalAmount: 1800,
      discountAmount: 0,
      taxAmount: 162,
      netAmount: 1962,
      paymentStatus: "pending",
      paymentMethod: "",
      items: [
        { description: "Room Charges (2 days)", quantity: 2, unitPrice: 400, totalPrice: 800 },
        { description: "Consultation", quantity: 1, unitPrice: 500, totalPrice: 500 },
        { description: "Medicines", quantity: 1, unitPrice: 500, totalPrice: 500 },
      ],
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    description: "",
    quantity: "",
    unitPrice: "",
    discountAmount: "",
  })

  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault()
    const totalAmount = Number.parseFloat(formData.quantity) * Number.parseFloat(formData.unitPrice)
    const discountAmount = Number.parseFloat(formData.discountAmount) || 0
    const taxAmount = (totalAmount - discountAmount) * 0.09
    const netAmount = totalAmount - discountAmount + taxAmount

    const newInvoice: Invoice = {
      id: String(invoices.length + 1),
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(5, "0")}`,
      patientName: formData.patientName,
      patientId: `P${String(invoices.length + 1).padStart(5, "0")}`,
      invoiceDate: new Date().toISOString().split("T")[0],
      totalAmount,
      discountAmount,
      taxAmount,
      netAmount,
      paymentStatus: "pending",
      paymentMethod: "",
      items: [
        {
          description: formData.description,
          quantity: Number.parseInt(formData.quantity),
          unitPrice: Number.parseFloat(formData.unitPrice),
          totalPrice: totalAmount,
        },
      ],
    }
    setInvoices([...invoices, newInvoice])
    setFormData({
      patientName: "",
      description: "",
      quantity: "",
      unitPrice: "",
      discountAmount: "",
    })
    setShowForm(false)
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "partial":
        return "bg-blue-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.paymentStatus === "paid" ? inv.netAmount : 0), 0)
  const pendingAmount = invoices.reduce((sum, inv) => sum + (inv.paymentStatus === "pending" ? inv.netAmount : 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Billing Management</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          {showForm ? "Cancel" : "Create Invoice"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-green-400 mt-2">${totalRevenue.toFixed(2)}</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Pending Amount</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">${pendingAmount.toFixed(2)}</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Total Invoices</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">{invoices.length}</p>
        </Card>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Create New Invoice</h3>
          <form onSubmit={handleAddInvoice} className="space-y-4">
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
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Unit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Discount Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.discountAmount}
                  onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">
              Create Invoice
            </Button>
          </form>
        </Card>
      )}

      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Invoice #</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Patient</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Total</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Net Amount</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="py-3 px-4 text-foreground font-medium">{invoice.invoiceNumber}</td>
                  <td className="py-3 px-4 text-foreground">{invoice.patientName}</td>
                  <td className="py-3 px-4 text-foreground">{invoice.invoiceDate}</td>
                  <td className="py-3 px-4 text-foreground">${invoice.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-foreground font-semibold">${invoice.netAmount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`${getPaymentStatusColor(invoice.paymentStatus)} px-3 py-1 text-white text-xs rounded-full`}
                    >
                      {invoice.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs">View</Button>
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
