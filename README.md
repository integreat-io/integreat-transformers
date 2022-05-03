# Integreat transformers

Core transformers for [Integreat](https://github.com/integreat-io/integreat) and
[MapTransform](https://github.com/integreat-io/map-transform).

## Transformers

The package consists of several transformers that are exported as an object with
the transformers set as properties.

### `string`

Transforms any given value to a string, according to normal JavaScript behavior,
except:

- Dates are transformed to an ISO string like `2019-05-22T13:43:11.345Z`
- Objects are transformed to `undefined`
- `null` and `undefined` are untouched

### `number`

Transforms any given value to a number if possible, or returns `undefined` if
not. Non-numbers are treated like the following:

- Strings are parsed with `parseFloat`
- Booleans are treated JavaScript style: `true` -> `1`, `false` -> `0`
- Dates are transformed to milliseconds since epoc (midnight 1970-01-01)
- `null` and `undefined` are untouched
- All other types will return `undefined`

### `date`

Tries its best at transforming the given value to a date, or returns
`undefined`.

- Dates are untouched, unless its an invalid date, which will return `undefined`
- Numbers are treated as milliseconds since epoc (midnight 1970-01-01), unless
  `isSeconds` is `true` (see below)
- Strings are parsed with [Luxon](https://moment.github.io/luxon) if a `format`
  or a `tz` (timezone) are specified (see below). If not, the string is handed
  to JavaScript's `new Date()`, which will try its best
- All other types returns `undefined

Date also have a few options (operands):

- `format`: [A Luxon format](https://moment.github.io/luxon/#/parsing?id=table-of-tokens)
  to use for parsing
- `tz`: A timezone to use when the given date is not specified with timezone.
  Supports the same timezones as Luxon, like IANA (`America/New_York`), fixed
  offset (`UTC+7`) and some others (like `system`).
- `isSeconds`: When `true`, a number will be treated as seconds since epoc,
  instead of milliseconds. Default is `false`

### 'truncate'

When a `length` operand is set, a given string that is longer than this length
is shortened. If a `postfix` is given, it is appended to the end and the total
length of the shortened text will still be no longer than `length`.
