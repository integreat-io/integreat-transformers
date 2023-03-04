import { mapTransform } from 'map-transform'

export function getPathOrData(path?: string) {
  return typeof path === 'string' ? mapTransform(path) : (data: unknown) => data
}

export function getPathOrDefault(
  path?: string,
  def?: unknown,
  predicate = (data: unknown) => !!data
) {
  if (typeof path !== 'string') {
    return () => def
  }
  const getter = mapTransform(path)

  return function getOrDefault(data: unknown) {
    const value = getter(data)
    return predicate(value) ? value : def
  }
}
