export const parseNum = (value: unknown) =>
  typeof value === 'string' ? Number.parseFloat(value) : value
