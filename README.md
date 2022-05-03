# Integreat transformers

Core transformers for Integreat.

## Transformers

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
