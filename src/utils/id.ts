/**
 * Generate a unique ID. Uses crypto.randomUUID() when available
 * (requires a secure context: HTTPS or localhost).
 * Falls back to a timestamp+random string on plain HTTP.
 */
export function generateId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
