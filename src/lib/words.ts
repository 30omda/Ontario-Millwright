export type Token = { text: string; word: boolean };

/**
 * Splits text into animatable words and whitespace. Uses Intl.Segmenter so Chinese (no spaces)
 * still splits; punctuation stays glued to its neighbour word so it never wraps onto its own line.
 */
export function tokenize(text: string, locale: string): Token[] {
  const out: Token[] = [];
  let prefix = ""; // leading punctuation waiting for the next word
  for (const seg of new Intl.Segmenter(locale, { granularity: "word" }).segment(text)) {
    const s = seg.segment;
    if (/^\s+$/.test(s)) {
      if (prefix) {
        out.push({ text: prefix, word: true });
        prefix = "";
      }
      out.push({ text: s, word: false });
    } else if (seg.isWordLike) {
      out.push({ text: prefix + s, word: true });
      prefix = "";
    } else {
      const last = out[out.length - 1];
      if (last?.word) last.text += s;
      else prefix += s;
    }
  }
  if (prefix) out.push({ text: prefix, word: true });
  return out;
}

export const countWords = (text: string, locale: string) => tokenize(text, locale).filter((t) => t.word).length;
