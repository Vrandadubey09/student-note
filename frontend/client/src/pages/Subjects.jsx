import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  getSubjectIcon,
  ICON_KEYS,
  SUBJECT_COLORS,
} from "../utils/subjectIcons";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Check,
  FolderOpen,
  FileText,
} from "lucide-react";

const DEFAULT_COLOR = SUBJECT_COLORS[0];
const DEFAULT_ICON = "book";

function SubjectModal({ initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || "");
  const [color, setColor] = useState(initial?.color || DEFAULT_COLOR);
  const [icon, setIcon] = useState(initial?.icon || DEFAULT_ICON);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Subject name is required");
      return;
    }
    setSaving(true);
    try {
      await onSave({ name: name.trim(), color, icon });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save subject");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">
            {initial ? "Edit subject" : "New subject"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mathematics"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                    color === c ? "ring-2 ring-offset-2 ring-gray-900 scale-110" : ""
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                >
                  {color === c && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ICON_KEYS.map((key) => {
                const Icon = getSubjectIcon(key);
                const active = icon === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIcon(key)}
                    className={`flex items-center justify-center h-12 rounded-xl border transition-colors cursor-pointer ${
                      active
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                    style={active ? { backgroundColor: color } : undefined}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {saving ? "Saving..." : initial ? "Save changes" : "Create subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // null | { mode, subject? }

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load subjects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const handleCreate = async (data) => {
    const res = await api.post("/subjects", data);
    setSubjects((prev) => [...prev, res.data]);
  };

  const handleUpdate = async (data) => {
    const res = await api.put(`/subjects/${modal.subject.id}`, data);
    setSubjects((prev) => prev.map((s) => (s.id === res.data.id ? res.data : s)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject and all its notes?")) return;
    try {
      await api.delete(`/subjects/${id}`);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete subject");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Subjects</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Organize your notes into color-coded subjects.
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "create" })}
          className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          New subject
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Loader2 size={28} className="animate-spin mb-3" />
          <span className="text-sm">Loading subjects...</span>
        </div>
      ) : subjects.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
          <FolderOpen size={28} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500 mb-4">
            No subjects yet. Create your first subject to start taking notes.
          </p>
          <button
            onClick={() => setModal({ mode: "create" })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            New subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => {
            const Icon = getSubjectIcon(subject.icon);
            return (
              <div
                key={subject.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${subject.color}1a`, color: subject.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-800 truncate">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {subject.noteCount} {subject.noteCount === 1 ? "note" : "notes"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/notes?subject=${subject.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <FileText size={14} />
                    View notes
                  </Link>
                  <button
                    onClick={() => setModal({ mode: "edit", subject })}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <SubjectModal
          key={modal.subject?.id || "new"}
          initial={modal.subject}
          onClose={() => setModal(null)}
          onSave={modal.mode === "edit" ? handleUpdate : handleCreate}
        />
      )}
    </div>
  );
}
