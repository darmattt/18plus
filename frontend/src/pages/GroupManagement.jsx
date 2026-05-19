import React, { useState } from "react"
import {
  Search,
  Plus,
  Trash2,
  X,
  Users,
  User,
  UserPlus,
} from "lucide-react"

export const GroupManagement = () => {
  const [groups, setGroups] = useState([
    {
      id: "1",
      name: "Klasse 9A",
      teacherName: "Anna Schmidt",
      students: [
        { id: "s1", name: "Max Mustermann", email: "max.mustermann@student.de" },
        { id: "s2", name: "Lisa Müller", email: "lisa.mueller@student.de" },
        { id: "s3", name: "Tom Weber", email: "tom.weber@student.de" },
      ],
    },
    {
      id: "2",
      name: "Klasse 9B",
      teacherName: "Michael Müller",
      students: [
        { id: "s4", name: "Sarah Klein", email: "sarah.klein@student.de" },
        { id: "s5", name: "Felix Schmidt", email: "felix.schmidt@student.de" },
      ],
    },
    {
      id: "3",
      name: "Klasse 10A",
      teacherName: "Sarah Weber",
      students: [
        { id: "s6", name: "Julia Becker", email: "julia.becker@student.de" },
      ],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [expandedGroups, setExpandedGroups] = useState(new Set(["1"]))
  const [groupFormData, setGroupFormData] = useState({
    name: "",
    teacherName: "",
  })
  const [studentFormData, setStudentFormData] = useState({
    name: "",
    email: "",
  })

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.students.some(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
  )

  const toggleGroup = (groupId) => {
    const newExpanded = new Set(expandedGroups)

    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }

    setExpandedGroups(newExpanded)
  }

  const handleCreateGroup = () => {
    const newGroup = {
      id: Date.now().toString(),
      name: groupFormData.name,
      teacherName: groupFormData.teacherName,
      students: [],
    }

    setGroups([...groups, newGroup])
    setGroupFormData({ name: "", teacherName: "" })
    setShowCreateGroupModal(false)
  }

  const handleDeleteGroup = (groupId) => {
    if (confirm("Möchten Sie diese Gruppe wirklich löschen?")) {
      setGroups(groups.filter((g) => g.id !== groupId))
    }
  }

  const handleAddStudent = () => {
    if (!selectedGroup) return

    const newStudent = {
      id: Date.now().toString(),
      name: studentFormData.name,
      email: studentFormData.email,
    }

    setGroups(
      groups.map((g) =>
        g.id === selectedGroup.id
          ? { ...g, students: [...g.students, newStudent] }
          : g
      )
    )

    setStudentFormData({ name: "", email: "" })
    setShowAddStudentModal(false)
    setSelectedGroup(null)
  }

  const handleDeleteStudent = (groupId, studentId) => {
    if (confirm("Möchten Sie diesen Schüler wirklich löschen?")) {
      setGroups(
        groups.map((g) =>
          g.id === groupId
            ? {
                ...g,
                students: g.students.filter((s) => s.id !== studentId),
              }
            : g
        )
      )
    }
  }

  const openAddStudentModal = (group) => {
    setSelectedGroup(group)
    setShowAddStudentModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Lerngruppen
          </h2>

          <p className="text-gray-600 mt-1">
            {groups.length} Gruppen mit{" "}
            {groups.reduce((sum, g) => sum + g.students.length, 0)} Schüler:innen
          </p>
        </div>

        <button
          onClick={() => setShowCreateGroupModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#c7d300] text-black rounded-xl font-bold hover:bg-[#b0ba00] transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Gruppe hinzufügen
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        <input
          type="text"
          placeholder="Nach Gruppe, Betreuer oder Schüler suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
        />
      </div>

      {/* Groups List */}
      <div className="grid gap-4">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#00a7e7] transition-all overflow-hidden"
          >
            {/* Group Header */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-[#006ddd]" />

                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {group.name}
                      </h3>

                      <p className="text-sm text-gray-600 mt-1">
                        Betreuer:in: {group.teacherName} •{" "}
                        {group.students.length} Schüler:innen
                      </p>
                    </div>
                  </div>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => openAddStudentModal(group)}
                    className="p-2 text-[#00a7e7] hover:bg-[#00a7e7]/10 rounded-lg transition-colors"
                    title="Schüler hinzufügen"
                  >
                    <UserPlus className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Gruppe löschen"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Students List */}
            {expandedGroups.has(group.id) && group.students.length > 0 && (
              <div className="border-t-2 border-gray-100 bg-gray-50 p-4">
                <div className="grid gap-2">
                  {group.students.map((student) => (
                    <div
                      key={student.id}
                      className="bg-white rounded-lg p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <User className="w-4 h-4 text-gray-400" />

                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {student.name}
                          </p>

                          <p className="text-xs text-gray-600">
                            {student.email}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleDeleteStudent(group.id, student.id)
                        }
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Schüler entfernen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {expandedGroups.has(group.id) && group.students.length === 0 && (
              <div className="border-t-2 border-gray-100 bg-gray-50 p-6 text-center text-gray-500 text-sm">
                Noch keine Schüler:innen in dieser Gruppe
              </div>
            )}
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Keine Gruppen gefunden</p>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="h-2 bg-gradient-to-r from-[#c7d300] via-[#00a7e7] to-[#006ddd]" />

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900">
                  Neue Gruppe erstellen
                </h3>

                <button
                  onClick={() => setShowCreateGroupModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Gruppenname
                  </label>

                  <input
                    type="text"
                    value={groupFormData.name}
                    onChange={(e) =>
                      setGroupFormData({
                        ...groupFormData,
                        name: e.target.value,
                      })
                    }
                    placeholder="z.B. Klasse 9A"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Betreuer:in
                  </label>

                  <input
                    type="text"
                    value={groupFormData.teacherName}
                    onChange={(e) =>
                      setGroupFormData({
                        ...groupFormData,
                        teacherName: e.target.value,
                      })
                    }
                    placeholder="z.B. Anna Schmidt"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                  />
                </div>

                <button
                  onClick={handleCreateGroup}
                  className="w-full py-3 bg-[#c7d300] text-black rounded-xl font-bold hover:bg-[#b0ba00] transition-colors shadow-lg"
                >
                  Gruppe erstellen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="h-2 bg-gradient-to-r from-[#c7d300] via-[#00a7e7] to-[#006ddd]" />

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900">
                  Schüler:in zu {selectedGroup.name} hinzufügen
                </h3>

                <button
                  onClick={() => {
                    setShowAddStudentModal(false)
                    setSelectedGroup(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    value={studentFormData.name}
                    onChange={(e) =>
                      setStudentFormData({
                        ...studentFormData,
                        name: e.target.value,
                      })
                    }
                    placeholder="z.B. Max Mustermann"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    E-Mail
                  </label>

                  <input
                    type="email"
                    value={studentFormData.email}
                    onChange={(e) =>
                      setStudentFormData({
                        ...studentFormData,
                        email: e.target.value,
                      })
                    }
                    placeholder="z.B. max.mustermann@student.de"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                  />
                </div>

                <button
                  onClick={handleAddStudent}
                  className="w-full py-3 bg-[#c7d300] text-black rounded-xl font-bold hover:bg-[#b0ba00] transition-colors shadow-lg"
                >
                  Schüler:in hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}