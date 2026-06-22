/** Prevent open-redirect via manipulated `next` query params. */
export function sanitizeRedirectPath(next: string | null | undefined): string {
  if (!next) return "/dashboard";
  if (!next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  if (next.includes("://")) return "/dashboard";
  return next;
}