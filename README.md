# Integreat transformers

Core transformers for Integreat.

## Transformers

### `string`

Transforms any given value to a string, according to normal JavaScript behavior,
except:

- Dates are transformed to an ISO string like `2019-05-22T13:43:11.345Z`
- Objects are transformed to `undefined`
- `null` and `undefined` are untouched
