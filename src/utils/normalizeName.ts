// Make matching of names insensitive to case, accents, and punctuation
const normalizeName = (name: string) =>
  name
    .normalize('NFD')
    .replace(/\p{M}/gu, '') // Remove accents
    .replace(/\./g, '') // `U.S.` matches `US`
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .toLowerCase()

export default normalizeName
