// lib/blog-utils.ts
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateExcerpt(content: string, length: number = 150): string {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, "");
  return plainText.length > length ? plainText.substring(0, length) + "..." : plainText;
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
