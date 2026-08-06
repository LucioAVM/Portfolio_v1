export function splitAccentHeading(text: string): { prefix: string; accent: string } {
  const words = text.trim().split(/\s+/);
  const accent = words.length > 1 ? words.pop()! : words[0] ?? '';
  return { prefix: words.join(' '), accent };
}
