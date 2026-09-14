import normalizeName from './normalizeName.js'

// Build a lookup table from normalized name to value. A name shared by more
// than one value is set to `null`, so that we don't guess. The same name with
// the same value is fine.
export default function buildReverseTable<T>(entries: Iterable<[string, T]>) {
  const table = new Map<string, T | null>()
  for (const [name, value] of entries) {
    const key = normalizeName(name)
    table.set(key, !table.has(key) || table.get(key) === value ? value : null)
  }
  return table
}
