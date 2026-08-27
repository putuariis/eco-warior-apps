const YOUTUBE_RE =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{6,}/i;

export function isYoutubeUrl(url: string) {
  return YOUTUBE_RE.test(url.trim());
}

export function normalizeYoutubeUrl(url: string) {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
