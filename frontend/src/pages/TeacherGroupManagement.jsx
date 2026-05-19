import React, { useEffect, useMemo, useState } from "react"
import { Search, Plus, Edit2, Trash2, X, Users, User, UserPlus, QrCode } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

import {
  addStudentToGroup,
  createTeacherGroup,
  deleteTeacherGroup,
  getTeacherGroups,
  removeStudentFromMyGroup,
  updateTeacherGroup,
} from "@/api/teacherApi"

export default function TeacherGroupManagement() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showEditGroupModal, setShowEditGroupModal] = useState(false)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [showQRCodeModal, setShowQRCodeModal] = useState(false)

  const [selectedGroup, setSelectedGroup] = useState(null)
  const [expandedGroups, setExpandedGroups] = useState(new Set())

  const [groupFormData, setGroupFormData] = useState({ name: "" })
  const [studentFormData, setStudentFormData] = useState({ email: "" })

  const loadGroups = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getTeacherGroups()

      const rawGroups = Array.isArray(data)
        ? data
        : Array.isArray(data?.groups)
          ? data.groups
          : Array.isArray(data?.data)
            ? data.data
            : []

      const normalizedGroups = rawGroups.map((group, groupIndex) => ({
        id: group.id ?? group.groupId ?? groupIndex + 1,
        name: group.name ?? group.classNumber ?? "Unbenannte Gruppe",
        students: Array.isArray(group.students)
          ? group.students.map((student, studentIndex) => ({
              id: student.id ?? student.studentId ?? studentIndex + 1,
              name:
                student.name ||
                `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
                "Unbekannt",
              email: student.email || student.emailAddress || "",
            }))
          : [],
      }))

      setGroups(normalizedGroups)
      setExpandedGroups(new Set(normalizedGroups.map((g) => String(g.id))))
    } catch (err) {
      setError(err.message || "Fehler beim Laden der Gruppen")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGroups()
  }, [])

  const filteredGroups = useMemo(() => {
    return groups.filter(
      (group) =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.students.some(
          (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
  }, [groups, searchTerm])

  const toggleGroup = (groupId) => {
    const key = String(groupId)
    const next = new Set(expandedGroups)

    if (next.has(key)) next.delete(key)
    else next.add(key)

    setExpandedGroups(next)
  }

  const handleCreateGroup = async () => {
    if (!groupFormData.name.trim()) return

    try {
      await createTeacherGroup(groupFormData.name.trim())
      setGroupFormData({ name: "" })
      setShowCreateGroupModal(false)
      await loadGroups()
    } catch (err) {
      alert(err.message || "Gruppe konnte nicht erstellt werden")
    }
  }

  const handleUpdateGroup = async () => {
    if (!selectedGroup || !groupFormData.name.trim()) return

    try {
      await updateTeacherGroup(selectedGroup.id, groupFormData.name.trim())
      setSelectedGroup(null)
      setGroupFormData({ name: "" })
      setShowEditGroupModal(false)
      await loadGroups()
    } catch (err) {
      alert(err.message || "Gruppe konnte nicht bearbeitet werden")
    }
  }

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Möchten Sie diese Gruppe wirklich löschen?")) return

    try {
      await deleteTeacherGroup(groupId)
      await loadGroups()
    } catch (err) {
      alert(err.message || "Gruppe konnte nicht gelöscht werden")
    }
  }

  const handleAddStudent = async () => {
    if (!selectedGroup || !studentFormData.email.trim()) return

    try {
      await addStudentToGroup(selectedGroup.id, studentFormData.email.trim().toLowerCase())
      setStudentFormData({ email: "" })
      setShowAddStudentModal(false)
      setSelectedGroup(null)
      await loadGroups()
    } catch (err) {
      alert(err.message || "Schüler:in konnte nicht hinzugefügt werden")
    }
  }

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm("Möchten Sie diesen Schüler aus der Gruppe entfernen?")) return

    try {
      await removeStudentFromMyGroup(studentId)
      await loadGroups()
    } catch (err) {
      alert(err.message || "Schüler:in konnte nicht entfernt werden")
    }
  }

  const openEditGroupModal = (group) => {
    setSelectedGroup(group)
    setGroupFormData({ name: group.name })
    setShowEditGroupModal(true)
  }

  const openAddStudentModal = (group) => {
    setSelectedGroup(group)
    setStudentFormData({ email: "" })
    setShowAddStudentModal(true)
  }

  const openQRCodeModal = (group) => {
    setSelectedGroup(group)
    setShowQRCodeModal(true)
  }

  if (loading) return <div className="p-6">Lädt Gruppen...</div>

  if (error) return <div className="p-6 text-red-600 font-bold">Fehler: {error}</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Meine Gruppen</h2>
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
          Gruppe erstellen
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Nach Gruppe oder Schüler suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
        />
      </div>

      <div className="grid gap-4">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#00a7e7] transition-all overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <button onClick={() => toggleGroup(group.id)} className="flex-1 text-left">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-[#006ddd]" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {group.students.length} Schüler:innen
                      </p>
                    </div>
                  </div>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => openQRCodeModal(group)}
                    className="p-2 text-[#c7d300] hover:bg-[#c7d300]/10 rounded-lg transition-colors"
                    title="QR-Code anzeigen"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => openAddStudentModal(group)}
                    className="p-2 text-[#00a7e7] hover:bg-[#00a7e7]/10 rounded-lg transition-colors"
                    title="Schüler hinzufügen"
                  >
                    <UserPlus className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => openEditGroupModal(group)}
                    className="p-2 text-[#00a7e7] hover:bg-[#00a7e7]/10 rounded-lg transition-colors"
                    title="Gruppe bearbeiten"
                  >
                    <Edit2 className="w-5 h-5" />
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

            {expandedGroups.has(String(group.id)) && group.students.length > 0 && (
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
                          <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                          <p className="text-xs text-gray-600">{student.email || "Keine E-Mail"}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveStudent(student.id)}
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

            {expandedGroups.has(String(group.id)) && group.students.length === 0 && (
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

      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="h-2 bg-gradient-to-r from-[#c7d300] via-[#00a7e7] to-[#006ddd]" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900">Neue Gruppe erstellen</h3>
                <button onClick={() => setShowCreateGroupModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Klassenname / classNumber
                  </label>
                  <input
                    type="text"
                    value={groupFormData.name}
                    onChange={(e) => setGroupFormData({ name: e.target.value })}
                    placeholder="z.B. 6BAIF"
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

      {showEditGroupModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="h-2 bg-gradient-to-r from-[#c7d300] via-[#00a7e7] to-[#006ddd]" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900">Gruppe bearbeiten</h3>
                <button
                  onClick={() => {
                    setShowEditGroupModal(false)
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
                    Klassenname / classNumber
                  </label>
                  <input
                    type="text"
                    value={groupFormData.name}
                    onChange={(e) => setGroupFormData({ name: e.target.value })}
                    placeholder="z.B. 7BAIF"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                  />
                </div>

                <button
                  onClick={handleUpdateGroup}
                  className="w-full py-3 bg-[#c7d300] text-black rounded-xl font-bold hover:bg-[#b0ba00] transition-colors shadow-lg"
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQRCodeModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="h-2 bg-gradient-to-r from-[#c7d300] via-[#00a7e7] to-[#006ddd]" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900">
                  QR-Code für {selectedGroup.name}
                </h3>
                <button
                  onClick={() => {
                    setShowQRCodeModal(false)
                    setSelectedGroup(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="p-6 bg-white border-4 border-gray-200 rounded-2xl">
                  <QRCodeSVG
                    value={`group:${selectedGroup.id}`}
                    size={200}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <p className="text-sm text-gray-600 text-center">
                  Scanne den Code oder gib diesen Gruppencode ein
                </p>

                <div className="w-full px-6 py-4 bg-gradient-to-r from-[#00a7e7]/10 to-[#c7d300]/10 rounded-xl border-2 border-dashed border-[#006ddd]">
                  <p className="text-3xl font-extrabold text-center text-gray-900 tracking-wider">
                    {String(selectedGroup.id).padStart(6, "0")}-
                    {selectedGroup.name.substring(0, 3).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <label className="block text-sm font-bold text-gray-700 mb-2">E-Mail</label>
                  <input
                    type="email"
                    value={studentFormData.email}
                    onChange={(e) => setStudentFormData({ email: e.target.value })}
                    placeholder="z.B. max.mustermann@18plus.local"
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