// Minimal, safe markdown renderer supporting basic formatting.
// All HTML is escaped first to prevent XSS; then simple inline rules
// are applied on the escaped text.

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function inline(text) {
  let t = escapeHtml(text);

  // Code spans
  t = t.replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`);

  // Links: [text](url)
  t = t.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_, label, url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`
  );

  // Bold
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Italic
  t = t.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");

  return t;
}

const inlineRegex = new RegExp(
  escapeRegex("**") + "|" + escapeRegex("*") + "|" + escapeRegex("`") + "|" + /\[/.source
);

export function renderMarkdown(md) {
  if (!md) return "<p></p>";

  const lines = md.split(/\r?\n/);
  const html = [];
  let listType = null;
  let codeBlock = null;

  const flushList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const raw of lines) {
    const line = raw;

    // Code block fences
    if (/^\s*```/.test(line)) {
      if (codeBlock) {
        html.push(`</pre>`);
        codeBlock = null;
      } else {
        flushList();
        html.push(`<pre>`);
        codeBlock = "";
      }
      continue;
    }
    if (codeBlock !== null) {
      codeBlock += escapeHtml(line) + "\n";
      continue;
    }

    const trimmed = line.trim();

    // Blank line
    if (trimmed === "") {
      flushList();
      html.push("");
      continue;
    }

    // Headings
    const h = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (h) {
      flushList();
      const level = h[1].length;
      html.push(`<h${level}>${inline(h[2])}</h${level}>`);
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(trimmed)) {
      flushList();
      html.push(`<blockquote>${inline(trimmed.replace(/^>\s?/, ""))}</blockquote>`);
      continue;
    }

    // Unordered list
    const uh = /^[-*+]\s+/.test(trimmed);
    if (uh) {
      if (listType !== "ul") {
        flushList();
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${inline(trimmed.replace(/^[-*+]\s+/, ""))}</li>`);
      continue;
    }

    // Ordered list
    const oh = /^\d+\.\s+/.exec(trimmed);
    if (oh) {
      if (listType !== "ol") {
        flushList();
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${inline(trimmed.replace(/^\d+\.\s+/, ""))}</li>`);
      continue;
    }

    // Paragraph
    flushList();
    html.push(`<p>${inline(trimmed)}</p>`);
  }

  if (codeBlock !== null) {
    html.push(`</pre>`);
  }
  flushList();

  return html.join("\n");
}
