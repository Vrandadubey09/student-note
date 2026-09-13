import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  formatBytes,
  formatFileDate,
} from "../utils/formatBytes";
import { isFileImage, fileUrl } from "../utils/fileHelpers";
import FilePreviewModal from "../components/FilePreviewModal";
import {
  Search,
  Loader2,
  FileText,
  ImageIcon,
  FolderOpen,
  Eye,
  Download,
  Trash2,
  FolderDown,
  Inbox,
} from "lucide-react";
import { getSubjectIcon } from "../utils/subjectIcons";

export default function FileManager() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    api
      .get("/files")
      .then((res) => setFiles(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load files"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = files.filter((f) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      f.name.toLowerCase().includes(q) ||
      (f.note?.title || "").toLowerCase().includes(q) ||
      (f.note?.subject?.name || "").toLowerCase().includes(q)
    );
  });

  const handleDelete = async (file) => {
    if (!window.confirm(`Delete "${file.name}"?`)) return;
    try {
      await api.delete(`/files/${file.id}`);
      setFiles((prev) => prev.filter((x) => x.id !== file.id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete file");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 shrink-0">
          <FolderDown size={18} className="text-emerald-600" />
        </span>
        <div>
          <h1 className="text-xl font-bold text-gray-900">File Manager</h1>
          <p className="text-sm text-gray-500">
            All uploaded files across your notes.
          </p>
        </div>
      </div>

      <div className="relative mt-5 mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by file name, note or subject..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
        />
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Loader2 size={28} className="animate-spin mb-3" />
          <span className="text-sm">Loading files...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
          <Inbox size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500 mb-1">
            {files.length === 0 ? "No files uploaded yet." : "No files match your search."}
          </p>
          {files.length === 0 && (
            <Link
              to="/notes/new"
              className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              Create a note and attach files
            </Link>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((file) => {
            const isImage = isFileImage(file);
            const subject = file.note?.subject;
            const SubjectIcon = subject ? getSubjectIcon(subject.icon) : null;
const handleDelete = async (file) => {
    if (!window.confirm(`Delete "${file.name}"?`)) return;
    try {
      await api.delete(`/files/${file.id}`);
      setFiles((prev) => prev.filter((x) => x.id !== file.id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete file");
    }
  };

  return (
              <li
                key={file.id}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50/50 transition-colors"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 shrink-0">
                  {isImage ? (
                    <ImageIcon size={18} className="text-gray-500" />
                  ) : (
                    <FileText size={18} className="text-gray-500" />
                  )}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400 truncate flex items-center gap-1.5 flex-wrap">
                    <span>{formatBytes(file.size)}</span>
                    <span>·</span>
                    <span>{formatFileDate(file.createdAt)}</span>
                  </p>
                  {file.note && (
                    <Link
                      to={`/notes/${file.noteId}`}
                      className="mt-1 inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      <FolderOpen size={12} />
                      {file.note.title}
                      {subject && SubjectIcon && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ml-1"
                          style={{
                            backgroundColor: `${subject.color}1a`,
                            color: subject.color,
                          }}
                        >
                          <SubjectIcon size={10} />
                          {subject.name}
                        </span>
                      )}
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setPreviewFile(file)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>
                  <a
                    href={fileUrl(file.path)}
                    download={file.name}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title="Download"
                  >
                    <Download size={16} />
                  </a>
                  <button
                    onClick={() => handleDelete(file)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
}