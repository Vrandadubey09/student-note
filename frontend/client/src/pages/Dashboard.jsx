import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { getSubjectIcon } from "../utils/subjectIcons";
import { relativeTime } from "../utils/relativeTime";
import {
  Search,
  Plus,
  FileText,
  FolderOpen,
  CalendarPlus,
  Clock,
  Loader2,
  ArrowRight,
  BookOpen,
} from "lucide-react";

const STAT_CONFIG = [
  { key: "totalNotes", label: "Total notes", icon: FileText, color: "bg-indigo-50 text-indigo-600" },
  { key: "subjectsCount", label: "Subjects", icon: FolderOpen, color: "bg-emerald-50 text-emerald-600" },
  { key: "notesThisWeek", label: "Added this week", icon: CalendarPlus, color: "bg-amber-50 text-amber-600" },
  { key: "daysUntilExam", label: "Days until next exam", icon: Clock, color: "bg-rose-50 text-rose-600", isExam: true },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [subRes, noteRes, statRes] = await Promise.all([
        api.get("/subjects"),
        api.get("/notes"),
        api.get("/users/stats"),
      ]);
      setSubjects(subRes.data);
      setNotes(noteRes.data);
      setStats(statRes.data);
    } catch (err) {
      console.error("[Dashboard] Failed to load dashboard data:", err);
      if (err.response?.status === 401) {
        logout();
        return;
      }
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notes.filter((note) => {
      const matchesSubject = activeSubject ? note.subjectId === activeSubject : true;
      const matchesSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        (note.content || "").toLowerCase().includes(q);
      return matchesSubject && matchesSearch;
    });
  }, [notes, search, activeSubject]);

  const recentNotes = useMemo(
    () => [...filteredNotes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6),
    [filteredNotes]
  );

  const subjectMap = useMemo(() => {
    const map = {};
    subjects.forEach((s) => (map[s.id] = s));
    return map;
  }, [subjects]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Loader2 size={28} className="animate-spin mb-3" />
        <span className="text-sm">Loading your dashboard...</span>
      </div>
    );
  }

  if (error && subjects.length === 0 && notes.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const displayName = user?.name || "Student";
  const courseInfo = [user?.course, user?.semester].filter(Boolean).join(" • ");

  const statCards = [
    { ...STAT_CONFIG[0], value: stats?.totalNotes ?? 0 },
    { ...STAT_CONFIG[1], value: stats?.subjectsCount ?? 0 },
    { ...STAT_CONFIG[2], value: stats?.notesThisWeek ?? 0 },
    {
      ...STAT_CONFIG[3],
      value: stats?.daysUntilExam ?? null,
      display: stats?.daysUntilExam == null ? "—" : stats.daysUntilExam,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            Hi, {displayName} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5 truncate">
            {courseInfo || "Welcome to your notes"}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <div className="flex flex-1 sm:flex-none items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200 shadow-sm focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition-all min-w-0 sm:w-64">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <select
            value={activeSubject || ""}
            onChange={(e) => setActiveSubject(e.target.value || null)}
            className="h-11 px-3 rounded-xl border border-gray-200 text-sm bg-white shadow-sm outline-none focus:border-gray-400 cursor-pointer"
          >
            <option value="">All subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate("/notes/new")}
            className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-sm shrink-0 cursor-pointer"
          >
            <Plus size={16} />
            New note
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.color} mb-3`}>
              <card.icon size={18} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none mb-1.5">
              {card.display !== undefined ? card.display : card.value}
            </p>
            <p className="text-xs text-gray-500 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Subjects */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">Subjects</h2>
          <Link
            to="/subjects"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            Manage <ArrowRight size={14} />
          </Link>
        </div>

        {subjects.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <FolderOpen size={24} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500 mb-3">
              No subjects yet. Create one to start organizing your notes.
            </p>
            <Link
              to="/subjects"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Add subject
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {subjects.map((subject) => {
              const Icon = getSubjectIcon(subject.icon);
              const active = activeSubject === subject.id;
              return (
                <button
                  key={subject.id}
                  onClick={() => setActiveSubject(active ? null : subject.id)}
                  className={`text-left bg-white rounded-2xl p-4 border-2 shadow-sm transition-all cursor-pointer hover:shadow-md ${
                    active ? "border-gray-900" : "border-gray-100"
                  }`}
                  title={`${subject.name} — ${subject.noteCount} note${subject.noteCount === 1 ? "" : "s"}`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${subject.color}1a`, color: subject.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 truncate">{subject.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {subject.noteCount} {subject.noteCount === 1 ? "note" : "notes"}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent notes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">Recent notes</h2>
        </div>

        {recentNotes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <BookOpen size={24} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              {search || activeSubject
                ? "No notes match your current filter."
                : "No notes yet. Click 'New note' to get started."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
            {recentNotes.map((note) => {
              const subject = subjectMap[note.subjectId];
              return (
                <Link
                  key={note.id}
                  to={`/notes/${note.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{note.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {subject && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                          style={{ backgroundColor: `${subject.color}1a`, color: subject.color }}
                        >
                          {(() => {
                            const Icon = getSubjectIcon(subject.icon);
                            return <Icon size={11} />;
                          })()}
                          {subject.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {relativeTime(note.updatedAt)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
