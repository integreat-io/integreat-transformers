# Integreat transformers

Core transformers for [Integreat](https://github.com/integreat-io/integreat) and
[MapTransform](https://github.com/integreat-io/map-transform).

## Transformers

The package consists of several transformers that are exported as an object with
the transformers set as properties.

### `string`

Transforms any given value to a string, according to normal JavaScript behavior,
except:

- Dates are transformed to an ISO string like `'2019-05-22T13:43:11.345Z'`
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

To round numbers, set the `precision` operand to the number of decimals to round
to. When `precision` is not set, the number will not be rounded.

Note that JavaScript rounds towards +∞ for negative numbers where the decimal 5
is rounded away. Other systems may round away from 0 in such cases.

### `boolean`

Transforms values to boolean by JavaScript rules, except the string `'false'`,
which is transformed to `false`. `null` and `undefined` are not touched.

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
  Supports the same timezones as Luxon, like IANA (`'America/New_York'`), fixed
  offset (`'UTC+7'`) and some others (like `system`).
- `isSeconds`: When `true`, a number will be treated as seconds since epoc,
  instead of milliseconds. Default is `false`

### `math`

Provides the math operations `add`, `subtract`, `multiply` and `divide`.

All operations accept a `value`, which will be used in the operation, e.g.:

- `{ operator: 'add', value: 1 }` will add 1 to the value from the pipeline
- `{ operator: 'subtract', value: 15 }` will subtract 15 from the pipeline value

For the operations where the pipeline value and the operator value is not
exchangable, like subtraction, where `10 - 15` is not the same as `15 - 10`, the
pipeline value will always be the first in the expression. Set the operand
`flip` to `true` to reverse this.

- The operations works in reverse as well, with `add` subtracting, `multiply`
  dividing, and the other way around
- Set the `rev` operand to `true` to "reverse the reversing", i.e. to apply the
  defined operation in reverse, and the oposite operation going forward
- If the pipeline value is a string, an attempt will be made to parse a number
  (float) from it
- If the pipeline number is not a number (or parsed to a number), it will result
  in `undefined`
- If the operand value is not a number, the pipeline value will be untouched

### `truncate`

When a `length` operand is set, a given string that is longer than this length
is shortened. If a `postfix` is given, it is appended to the end and the total
length of the shortened text will still be no longer than `length`.
