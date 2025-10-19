"use client"

import { Card } from "@/components/ui/card"
import { Header } from "../header"
import { BillingManagement } from "@/components/modules/billing-management"

interface AccountantDashboardProps {
  activeModule: string
  userName: string
  onLogout: () => void
}

export function AccountantDashboard({ activeModule, userName, onLogout }: AccountantDashboardProps) {
  const stats = [
    { label: "Total Revenue", value: "$125.4K", color: "bg-green-500" },
    { label: "Pending Payments", value: "$32.1K", color: "bg-yellow-500" },
    { label: "Invoices Issued", value: "342", color: "bg-blue-500" },
    { label: "Collection Rate", value: "87%", color: "bg-purple-500" },
  ]

  const renderContent = () => {
    switch (activeModule) {
      case "billing":
        return <BillingManagement />
      case "invoices":
        return <InvoicesModule />
      case "payments":
        return <PaymentsModule />
      case "reports":
        return <ReportsModule />
      default:
        return <OverviewModule stats={stats} />
    }
  }

  return (
    <div>
      <Header title="Accountant Dashboard" userRole="accountant" userName={userName} onLogout={onLogout} />
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
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Invoices</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Invoice #</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Patient</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="py-3 px-4 text-foreground">INV-{String(i).padStart(5, "0")}</td>
                  <td className="py-3 px-4 text-foreground">Patient {i}</td>
                  <td className="py-3 px-4 text-foreground">${(i * 1000).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        i % 2 === 0 ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                      }`}
                    >
                      {i % 2 === 0 ? "Paid" : "Pending"}
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

function InvoicesModule() {
  return (
    <div>
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Invoices</h3>
        <p className="text-slate-400">Invoice management will be displayed here</p>
      </Card>
    </div>
  )
}

function PaymentsModule() {
  return (
    <div>
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Payment Tracking</h3>
        <p className="text-slate-400">Payment tracking will be displayed here</p>
      </Card>
    </div>
  )
}

function ReportsModule() {
  return (
    <div>
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Financial Reports</h3>
        <p className="text-slate-400">Financial reports will be displayed here</p>
      </Card>
    </div>
  )
}
