import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { renderMarkdown } from "../utils/markdown";
import { Loader2, ArrowLeft, Save, Eye, FilePenLine } from "lucide-react";

const editorCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 font-mono";

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [subjects, setSubjects] = useState([]);
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    api
      .get("/subjects")
      .then((res) => {
        setSubjects(res.data);
        if (!isEdit && res.data.length > 0) setSubjectId(res.data[0].id);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load subjects"));

    if (isEdit) {
      api
        .get(`/notes/${id}`)
        .then((res) => {
          setTitle(res.data.title || "");
          setSubjectId(res.data.subjectId || "");
          setContent(res.data.content || "");
        })
        .catch((err) => setError(err.response?.data?.message || "Failed to load note"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!subjectId) {
      setError("Please select a subject");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/notes/${id}`, { title: title.trim(), subjectId, content });
      } else {
        const res = await api.post("/notes", { title: title.trim(), subjectId, content });
        navigate(`/notes/${res.data.id}`, { replace: true });
        return;
      }
      navigate(`/notes/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save note");
      setSaving(false);
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

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to={isEdit ? `/notes/${id}` : "/notes"}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        {isEdit ? "Back to note" : "Back to notes"}
      </Link>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? "Edit note" : "New note"}
          </h1>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPreview(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                !preview
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FilePenLine size={14} />
              Write
            </button>
            <button
              type="button"
              onClick={() => setPreview(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                preview
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Eye size={14} />
              Preview
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Write in Markdown — bold, headings, lists, links and code are supported.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 5 — Thermodynamics"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            >
              <option value="">Select a subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Content
            </label>
            {preview ? (
              <div
                className={`min-h-[300px] px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 prose-sm markdown-body max-w-none overflow-auto`}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={"# Heading\n\nWrite **bold**, *italic*, `code`, - lists, and [links](https://...)"}
                rows={12}
                className={editorCls}
              />
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate(isEdit ? `/notes/${id}` : "/notes")}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Save size={16} />
              {saving ? "Saving..." : isEdit ? "Save changes" : "Create note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
