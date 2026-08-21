import type { Company } from "./types";

/**
 * The Bangalore map shows a single big letter per company on its pin.
 * We pick the first letter of the first non-trivial word, with a few
 * smart overrides for common Indian business prefixes (Mahindra → M,
 * CEAT → C, etc — the first capital letter works for almost everything
 * in this dataset).
 */
export function companyLetter(c: Company): string {
  const name = c.name.trim();
  // Acronyms (all-caps, ≤4 chars): use first letter
  if (/^[A-Z&]{2,5}/.test(name)) {
    const m = name.match(/[A-Z&]/);
    if (m) return m[0];
  }
  // first letter of first word
  return name.charAt(0).toUpperCase();
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}