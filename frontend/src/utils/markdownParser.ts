import DOMPurify from "dompurify";

/**
 * Simple markdown parser for basic formatting (fallback)
 * Handles ## and ### headers, **bold**, *italic*, and line breaks
 */
export function parseSimpleMarkdown(text: string): string {
  if (!text) return "";

  const html = text
    // Convert ### headers (h3)
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">$1</h3>'
    )
    // Convert ## headers (h2)
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-xl font-semibold text-gray-800 mt-5 mb-3">$1</h2>'
    )
    // Convert # headers (h1)
    .replace(
      /^# (.+)$/gm,
      '<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-4 border-b border-gray-200 pb-2">$1</h1>'
    )
    // Convert **bold**
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold text-gray-900">$1</strong>'
    )
    // Convert *italic*
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
    // Convert line breaks
    .replace(/\n/g, "<br />");

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["h1", "h2", "h3", "strong", "em", "br"],
    ALLOWED_ATTR: ["class"],
  });
}

/**
 * Get plain text from markdown by stripping all formatting
 * @param markdown - The markdown text to convert
 * @returns Plain text string
 */
export function getPlainTextFromMarkdown(markdown: string): string {
  if (!markdown) return "";

  return (
    markdown
      // Remove headers
      .replace(/^#{1,6} (.+)$/gm, "$1")
      // Remove bold
      .replace(/\*\*(.*?)\*\*/g, "$1")
      // Remove italic
      .replace(/\*(.*?)\*/g, "$1")
      // Remove inline code
      .replace(/`(.*?)`/g, "$1")
      // Convert line breaks to spaces for truncation
      .replace(/\n/g, " ")
      // Clean up multiple spaces
      .replace(/\s+/g, " ")
      .trim()
  );
}
