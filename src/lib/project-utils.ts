// lib/project-utils.ts
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateTags(tags: any): string[] {
  let parsedTags: string[] = [];

  if (tags) {
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = [];
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }
  }

  return parsedTags;
}
