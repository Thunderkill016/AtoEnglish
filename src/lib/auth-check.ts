/**
 * Checks client-side if a Supabase auth session exists.
 * This reads cookies or localStorage keys to determine if the user has logged in,
 * avoiding the need to load the heavy Supabase client SDK on static public routes.
 */
export function checkHasSession(): boolean {
  if (typeof window === "undefined") return false;

  // 1. Check cookies (Supabase SSR auth cookies start with "sb-")
  try {
    const hasSbCookie = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("sb-"));
    if (hasSbCookie) return true;
  } catch {
    // Suppress cookie errors in environments where document.cookie is blocked
  }

  // 2. Check localStorage (Supabase client fallback storage keys)
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
        return true;
      }
    }
  } catch {
    // Suppress localStorage errors (e.g. storage disabled in private browsing)
  }

  return false;
}
