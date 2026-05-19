import React, { useState } from "react"
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Mail,
  User,
  Users,
  FileText,
} from "lucide-react"

export const TeacherAdminManagement = () => {
  const [teachers, setTeachers] = useState([
    {
      id: "1",
      name: "Anna Schmidt",
      email: "anna.schmidt@schule.de",
      groupName: "Klasse 9A",
      additionalInfo: "Mathematik & Physik",
    },
    {
      id: "2",
      name: "Michael Müller",
      email: "michael.mueller@schule.de",
      groupName: "Klasse 9B",
      additionalInfo: "Deutsch & Geschichte",
    },
    {
      id: "3",
      name: "Sarah Weber",
      email: "sarah.weber@schule.de",
      groupName: "Klasse 10A",
    },
  ])

  const [availableGroups] = useState([
    "Klasse 9A",
    "Klasse 9B",
    "Klasse 10A",
    "Klasse 10B",
    "Klasse 11A",
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    groupName: "",
    additionalInfo: "",
  })

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = () => {
    const newTeacher = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      groupName: formData.groupName,
      additionalInfo: formData.additionalInfo || undefined,
    }

    setTeachers([...teachers, newTeacher])

    setFormData({
      name: "",
      email: "",
      groupName: "",
      additionalInfo: "",
    })

    setShowCreateModal(false)
  }

  const handleUpdate = () => {
    if (!editingTeacher) return

    setTeachers(
      teachers.map((t) =>
        t.id === editingTeacher.id
          ? {
              ...t,
              name: formData.name,
              email: formData.email,
              groupName: formData.groupName,
              additionalInfo: formData.additionalInfo || undefined,
            }
          : t
      )
    )

    setEditingTeacher(null)

    setFormData({
      name: "",
      email: "",
      groupName: "",
      additionalInfo: "",
    })
  }

  const handleDelete = (id) => {
    if (confirm("Möchten Sie diesen Betreuer wirklich löschen?")) {
      setTeachers(teachers.filter((t) => t.id !== id))
    }
  }

  const openEditModal = (teacher) => {
    setEditingTeacher(teacher)

    setFormData({
      name: teacher.name,
      email: teacher.email,
      groupName: teacher.groupName,
      additionalInfo: teacher.additionalInfo || "",
    })
  }

  const closeModal = () => {
    setShowCreateModal(false)
    setEditingTeacher(null)

    setFormData({
      name: "",
      email: "",
      groupName: "",
      additionalInfo: "",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Betreuer:innen & zugewiesene Gruppen
          </h2>

          <p className="text-gray-600 mt-1">
            {teachers.length} Betreuer:innen gesamt
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#c7d300] text-black rounded-xl font-bold hover:bg-[#b0ba00] transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Betreuer hinzufügen
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

        <input
          type="text"
          placeholder="Nach Name, E-Mail oder Gruppe suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
        />
      </div>

      {/* Teachers List */}
      <div className="grid gap-4">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#00a7e7] transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#006ddd]" />

                  <h3 className="text-lg font-bold text-gray-900">
                    {teacher.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{teacher.email}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {teacher.groupName}
                  </span>
                </div>

                {teacher.additionalInfo && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-4 h-4" />

                    <span className="text-sm italic">
                      {teacher.additionalInfo}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(teacher)}
                  className="p-2 text-[#00a7e7] hover:bg-[#00a7e7]/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleDelete(teacher.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Keine Betreuer gefunden</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingTeacher) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="h-2 bg-gradient-to-r from-[#c7d300] via-[#00a7e7] to-[#006ddd]" />

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900">
                  {editingTeacher
                    ? "Betreuer bearbeiten"
                    : "Neuer Betreuer"}
                </h3>

                <button
                  onClick={closeModal}
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
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    placeholder="z.B. Anna Schmidt"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    E-Mail
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    placeholder="z.B. anna.schmidt@schule.de"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Lerngruppe zuweisen
                  </label>

                  <select
                    value={formData.groupName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        groupName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all"
                  >
                    <option value="">
                      Gruppe auswählen...
                    </option>

                    {availableGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Zusätzliche Informationen (optional)
                  </label>

                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additionalInfo: e.target.value,
                      })
                    }
                    placeholder="z.B. Fachgebiete, Spezialisierung..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00a7e7] focus:outline-none focus:ring-2 focus:ring-[#00a7e7]/20 transition-all resize-none"
                  />
                </div>

                <button
                  onClick={editingTeacher ? handleUpdate : handleCreate}
                  disabled={
                    !formData.name ||
                    !formData.email ||
                    !formData.groupName
                  }
                  className="w-full py-3 bg-[#c7d300] text-black rounded-xl font-bold hover:bg-[#b0ba00] transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {editingTeacher ? "Speichern" : "Hinzufügen"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}