import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { renderMarkdown } from "../utils/markdown";
import { getSubjectIcon } from "../utils/subjectIcons";
import { relativeTime } from "../utils/relativeTime";
import {
  ArrowLeft,
  Loader2,
  Calendar,
  Pencil,
  Trash2,
  BookOpen,
} from "lucide-react";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/notes/${id}`)
      .then((res) => setNote(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load note"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      navigate("/notes");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete note");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Loader2 size={28} className="animate-spin mb-3" />
        <span className="text-sm">Loading note...</span>
      </div>
    );
  }

  if (error && !note) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <Link
          to="/notes"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to notes
        </Link>
      </div>
    );
  }

  const subject = note.subject;
  const SubjectIcon = subject ? getSubjectIcon(subject.icon) : BookOpen;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <Link
          to="/notes"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to notes
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/notes/${id}/edit`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      <article className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {subject && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: `${subject.color}1a`, color: subject.color }}
            >
              <SubjectIcon size={12} />
              {subject.name}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 break-words">
          {note.title}
        </h1>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 pb-4 border-b border-gray-100 flex-wrap">
          <Calendar size={12} />
          <span>Updated {relativeTime(note.updatedAt)}</span>
        </div>

        <div
          className="markdown-body text-gray-700 leading-relaxed break-words max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) }}
        />
      </article>
    </div>
  );
}
