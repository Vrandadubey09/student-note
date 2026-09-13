import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { getSubjectIcon } from "../utils/subjectIcons";
import { relativeTime } from "../utils/relativeTime";
import {
  Search,
  Plus,
  Loader2,
  FileText,
  Pencil,
  Trash2,
  Paperclip,
} from "lucide-react";

export default function Notes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get("subject") || "";

  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState(initialSubject);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSubjects = useCallback(async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch {
      // non-fatal
    }
  }, []);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
    loadNotes();
  }, [loadSubjects, loadNotes]);

  const subjectMap = useMemo(() => {
    const map = {};
    subjects.forEach((s) => (map[s.id] = s));
    return map;
  }, [subjects]);

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notes.filter((note) => {
      const matchesSubject = subjectFilter ? note.subjectId === subjectFilter : true;
      const matchesSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        (note.content || "").toLowerCase().includes(q);
      return matchesSubject && matchesSearch;
    });
  }, [notes, search, subjectFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete note");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Notes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            All your study notes.
          </p>
        </div>
        <button
          onClick={() => navigate("/notes/new")}
          className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          New note
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-1 items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200 shadow-sm focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all min-w-0">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or content..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="h-11 px-3 rounded-xl border border-gray-200 text-sm bg-white shadow-sm outline-none focus:border-gray-400"
        >
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Loader2 size={28} className="animate-spin mb-3" />
          <span className="text-sm">Loading notes...</span>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
          <FileText size={28} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">
            {search || subjectFilter
              ? "No notes match your search."
              : "No notes yet. Click 'New note' to start."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const subject = subjectMap[note.subjectId];
            const Icon = subject ? getSubjectIcon(subject.icon) : null;
            const preview = (note.content || "").replace(/[#*`>_-]/g, "").trim() || "No content";
            return (
              <div
                key={note.id}
                className="flex flex-col bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <Link
                  to={`/notes/${note.id}`}
                  className="group flex-1 focus:outline-none"
                >
                  <h3 className="text-base font-semibold text-gray-800 group-hover:text-gray-600 transition-colors line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 break-words">
                    {preview.length > 120 ? `${preview.slice(0, 120)}...` : preview}
                  </p>
                </Link>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 gap-2 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    {subject && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium truncate"
                        style={{ backgroundColor: `${subject.color}1a`, color: subject.color }}
                      >
                        {Icon && <Icon size={11} className="shrink-0" />}
                        <span className="truncate">{subject.name}</span>
                      </span>
                    )}
                    {note.files?.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                        <Paperclip size={11} />
                        {note.files.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] text-gray-400 whitespace-nowrap">
                      {relativeTime(note.updatedAt)}
                    </span>
                    <button
                      onClick={() => navigate(`/notes/${note.id}/edit`)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
