/** URL-safe slug matching `scripts/generate-vocab-audio.py`. */
export function vocabAudioUrl(word: string): string {
  const slug = word
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `/audio/vocab/${slug}.mp3`;
}

/** MP3 for a word's example sentence, keyed from the word itself the same
 * way the rest of the card is (script writes `<word-slug>.example.mp3`). */
export function vocabExampleAudioUrl(word: string): string {
  const slug = word
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `/audio/vocab/${slug}.example.mp3`;
}
