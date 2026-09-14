export type Style = 'long' | 'short' | 'narrow'

export interface Props extends Record<string, unknown> {
  locale?: string
  style?: Style
}

const styles = new Set<unknown>(['long', 'short', 'narrow'])

export const toStyle = (style: unknown): Style =>
  styles.has(style) ? (style as Style) : 'long'

// Returns the locale `Intl.DateTimeFormat` will use for the given locale tag,
// so that e.g. `'nb'` and `'nb-NO'` resolve to the same locale
export function resolveLocale(locale?: string) {
  try {
    return new Intl.DateTimeFormat([locale ?? 'en', 'en']).resolvedOptions()
      .locale
  } catch {
    return 'en' // Invalid locale tag -- fall back to English
  }
}

// Returns 7 weekday names starting with Sunday, or 12 month names starting
// with January. Formatting in UTC means the local timezone can't shift the day.
export function getNames(
  field: 'weekday' | 'month',
  style: Style,
  locale: string,
): string[] {
  const { format } = new Intl.DateTimeFormat(locale, {
    [field]: style,
    timeZone: 'UTC',
  })
  return field === 'weekday'
    ? Array.from({ length: 7 }, (_, day) => format(Date.UTC(1970, 0, 4 + day))) // 1970-01-04 was a Sunday
    : Array.from({ length: 12 }, (_, month) => format(Date.UTC(2000, month, 1)))
}

// Returns integers, and strings holding only an integer, as a number
export function toInteger(value: unknown): number | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed === '' ? undefined : toInteger(Number(trimmed))
  }
  return Number.isInteger(value) ? (value as number) : undefined
}
