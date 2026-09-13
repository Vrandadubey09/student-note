import { X, ImageIcon, FileText, Download } from "lucide-react";
import { fileUrl, isFileImage, isFilePdf } from "../utils/fileHelpers";

export default function FilePreviewModal({ file, onClose }) {
  if (!file) return null;
  const url = fileUrl(file.path);
  const image = isFileImage(file);
  const pdf = isFilePdf(file);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 shrink-0">
              {image ? (
                <ImageIcon size={16} className="text-gray-500" />
              ) : (
                <FileText size={16} className="text-gray-500" />
              )}
            </span>
            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={url}
              download={file.name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Download size={14} />
              Download
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-gray-50">
          {image ? (
            <img src={url} alt={file.name} className="w-full h-full object-contain" />
          ) : pdf ? (
            <iframe src={url} title={file.name} className="w-full h-full" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 h-full text-gray-400">
              <FileText size={40} />
              <p className="text-sm">No inline preview available for this file type.</p>
              <a
                href={url}
                download={file.name}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                <Download size={15} />
                Download file
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}