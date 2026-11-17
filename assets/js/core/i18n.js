// All UI text goes through t(). The site ships German only; a second dictionary adds EN later.
const strings = {};

/** Merges a dictionary { key: 'Text mit {platzhalter}' } into the active strings. */
export function registerStrings(dict) {
  Object.assign(strings, dict);
}

/** Looks up a key and fills {placeholders}. A missing key is returned as-is so it is visible. */
export function t(key, vars = {}) {
  const text = strings[key];
  if (text === undefined) return key;
  return text.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? String(vars[name]) : m));
}

/** Fills every element carrying data-t="key" below root. */
export function applyStrings(root = document) {
  for (const el of root.querySelectorAll('[data-t]')) el.textContent = t(el.dataset.t);
}
