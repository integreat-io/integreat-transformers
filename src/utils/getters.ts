import mapTransform from 'map-transform'

export type Predicate = (value: unknown) => boolean

export function getPathOrData(path?: string) {
  return typeof path === 'string'
    ? mapTransform(path)
    : async (data: unknown) => data
}

export function getPathOrDefault(
  path?: string,
  def?: unknown,
  predicate: Predicate = (data: unknown) => data !== undefined,
) {
  if (typeof path !== 'string') {
    return async () => def
  }
  const getter = mapTransform(path, { nonvalues: [undefined] })

  return async function getOrDefault(data: unknown) {
    const value = await getter(data)
    return predicate(value) ? value : def
  }
}
