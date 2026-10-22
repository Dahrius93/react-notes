/**
 * Turns any text into a URL-friendly slug.
 *
 * @example
 * slugify('Città & Caffè: 10 idee!') // 'citta-caffe-10-idee'
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD') // split letters and accents: "è" → "e" + "̀"
    .replace(/[̀-ͯ]/g, '') // drop the accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // anything else becomes a dash
    .replace(/^-+|-+$/g, '') // no dashes at the start or end
}
