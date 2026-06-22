/** App routes that require an authenticated Supabase session. */
export const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/learn",
  "/flashcards",
  "/progress",
  "/speaking",
  "/roadmap",
  "/quiz",
  "/quality",
  "/settings",
  "/certificate",
] as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((route) => pathname.startsWith(route));
}