"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Room {
  id: string
  roomNumber: string
  roomType: "general" | "semi-private" | "private" | "icu" | "icu-hd"
  floorNumber: number
  capacity: number
  availableBeds: number
  status: "available" | "occupied" | "maintenance"
  dailyRate: number
  occupants: string[]
}

export function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      roomNumber: "101",
      roomType: "general",
      floorNumber: 1,
      capacity: 4,
      availableBeds: 2,
      status: "occupied",
      dailyRate: 100,
      occupants: ["John Doe", "Jane Smith"],
    },
    {
      id: "2",
      roomNumber: "102",
      roomType: "semi-private",
      floorNumber: 1,
      capacity: 2,
      availableBeds: 1,
      status: "occupied",
      dailyRate: 200,
      occupants: ["Mike Johnson"],
    },
    {
      id: "3",
      roomNumber: "201",
      roomType: "private",
      floorNumber: 2,
      capacity: 1,
      availableBeds: 1,
      status: "available",
      dailyRate: 400,
      occupants: [],
    },
    {
      id: "4",
      roomNumber: "301",
      roomType: "icu",
      floorNumber: 3,
      capacity: 2,
      availableBeds: 0,
      status: "occupied",
      dailyRate: 800,
      occupants: ["Patient A", "Patient B"],
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "general" as const,
    floorNumber: "",
    capacity: "",
    dailyRate: "",
  })

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault()
    const newRoom: Room = {
      id: String(rooms.length + 1),
      roomNumber: formData.roomNumber,
      roomType: formData.roomType,
      floorNumber: Number.parseInt(formData.floorNumber),
      capacity: Number.parseInt(formData.capacity),
      availableBeds: Number.parseInt(formData.capacity),
      status: "available",
      dailyRate: Number.parseFloat(formData.dailyRate),
      occupants: [],
    }
    setRooms([...rooms, newRoom])
    setFormData({
      roomNumber: "",
      roomType: "general",
      floorNumber: "",
      capacity: "",
      dailyRate: "",
    })
    setShowForm(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "occupied":
        return "bg-blue-500"
      case "maintenance":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case "general":
        return "bg-slate-600"
      case "semi-private":
        return "bg-slate-600"
      case "private":
        return "bg-slate-600"
      case "icu":
        return "bg-red-600"
      case "icu-hd":
        return "bg-red-700"
      default:
        return "bg-slate-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Room/Ward Management</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          {showForm ? "Cancel" : "Add Room"}
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Add New Room</h3>
          <form onSubmit={handleAddRoom} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Room Number</label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Room Type</label>
                <select
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value as any })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="general">General</option>
                  <option value="semi-private">Semi-Private</option>
                  <option value="private">Private</option>
                  <option value="icu">ICU</option>
                  <option value="icu-hd">ICU-HD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Floor Number</label>
                <input
                  type="number"
                  value={formData.floorNumber}
                  onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Capacity (Beds)</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Daily Rate ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.dailyRate}
                  onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full">
              Add Room
            </Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-800 border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Total Rooms</p>
          <p className="text-3xl font-bold text-foreground mt-2">{rooms.length}</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Available Beds</p>
          <p className="text-3xl font-bold text-green-400 mt-2">{rooms.reduce((sum, r) => sum + r.availableBeds, 0)}</p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Occupied Beds</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">
            {rooms.reduce((sum, r) => sum + (r.capacity - r.availableBeds), 0)}
          </p>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Occupancy Rate</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">
            {Math.round(
              (rooms.reduce((sum, r) => sum + (r.capacity - r.availableBeds), 0) /
                rooms.reduce((sum, r) => sum + r.capacity, 0)) *
                100,
            )}
            %
          </p>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Room #</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Floor</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Beds</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Available</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Daily Rate</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-slate-700 hover:bg-slate-700">
                  <td className="py-3 px-4 text-foreground font-medium">{room.roomNumber}</td>
                  <td className="py-3 px-4">
                    <span className={`${getRoomTypeColor(room.roomType)} px-3 py-1 text-white text-xs rounded-full`}>
                      {room.roomType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground">{room.floorNumber}</td>
                  <td className="py-3 px-4 text-foreground">{room.capacity}</td>
                  <td className="py-3 px-4 text-foreground">{room.availableBeds}</td>
                  <td className="py-3 px-4 text-foreground">${room.dailyRate}</td>
                  <td className="py-3 px-4">
                    <span className={`${getStatusColor(room.status)} px-3 py-1 text-white text-xs rounded-full`}>
                      {room.status}
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
