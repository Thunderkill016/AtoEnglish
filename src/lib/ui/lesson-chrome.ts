/** Hide app chrome on full-screen lesson players (v1 unit + v2 l-*). */
export function isLessonChromeHidden(pathname: string): boolean {
  return /^\/learn\/unit/.test(pathname) || /^\/learn\/v2\//.test(pathname);
}
