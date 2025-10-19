"use client"

interface SidebarProps {
  userRole: string
  activeModule: string
  onModuleChange: (module: string) => void
}

export function Sidebar({ userRole, activeModule, onModuleChange }: SidebarProps) {
  const getMenuItems = () => {
    const commonItems = [{ id: "overview", label: "Overview", icon: "📊" }]

    const roleMenus: Record<string, Array<{ id: string; label: string; icon: string }>> = {
      admin: [
        ...commonItems,
        { id: "users", label: "Users & Staff", icon: "👥" },
        { id: "patients", label: "Patients", icon: "🏥" },
        { id: "rooms", label: "Rooms/Wards", icon: "🛏️" },
        { id: "billing", label: "Billing", icon: "💰" },
        { id: "reports", label: "Reports", icon: "📈" },
      ],
      doctor: [
        ...commonItems,
        { id: "appointments", label: "Appointments", icon: "📅" },
        { id: "patients", label: "My Patients", icon: "👨‍⚕️" },
        { id: "opd", label: "OPD Consultations", icon: "🩺" },
        { id: "ot", label: "OT Schedule", icon: "🏥" },
      ],
      receptionist: [
        ...commonItems,
        { id: "registration", label: "Patient Registration", icon: "📝" },
        { id: "appointments", label: "Appointments", icon: "📅" },
        { id: "emergency", label: "Emergency Cases", icon: "🚨" },
      ],
      accountant: [
        ...commonItems,
        { id: "billing", label: "Billing", icon: "💰" },
        { id: "invoices", label: "Invoices", icon: "📄" },
        { id: "payments", label: "Payments", icon: "💳" },
        { id: "reports", label: "Financial Reports", icon: "📊" },
      ],
      radiologist: [
        ...commonItems,
        { id: "tests", label: "Radiology Tests", icon: "🔬" },
        { id: "reports", label: "Reports", icon: "📋" },
      ],
    }

    return roleMenus[userRole] || commonItems
  }

  const menuItems = getMenuItems()

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-cyan-400">HMS</h1>
        <p className="text-slate-400 text-sm mt-1">Hospital Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
              activeModule === item.id ? "bg-cyan-500 text-white" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center">HMS v1.0</p>
      </div>
    </aside>
  )
}
