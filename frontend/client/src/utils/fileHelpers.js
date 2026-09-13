import api from "../api/axios";

const API_ORIGIN = (api.defaults.baseURL || "").replace(/\/api$/, "");

export function fileUrl(path) {
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isFileImage(file) {
  if (file.mimeType) {
    return typeof file.mimeType === "string" && file.mimeType.startsWith("image/");
  }
  return /\.(png|jpe?g|gif|svg|webp|bmp|ico)$/i.test(file.name || "");
}

export function isFilePdf(file) {
  if (file.mimeType) {
    return file.mimeType === "application/pdf";
  }
  return /\.pdf$/i.test(file.name || "");
}