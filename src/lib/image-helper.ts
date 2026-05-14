/**
 * Encodes non-ASCII characters in image URLs for cross-platform compatibility.
 * Some hosting environments (Linux) fail to serve files with Cyrillic URLs.
 */
export function encodeImageUrl(url: string | null): string {
  if (!url) return '/placeholder.svg';
  // Replace non-ASCII characters with percent-encoded equivalents
  return url.replace(/[^\x20-\x7E]/g, c => encodeURIComponent(c));
}
