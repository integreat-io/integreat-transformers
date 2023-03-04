export function ensureArray<T = unknown>(value: T | T[]): NonNullable<T>[] {
  return ([] as T[])
    .concat(value)
    .filter(
      (item: T): item is NonNullable<T> => item !== undefined && item !== null
    )
}
