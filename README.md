# Integreat transformers

Core transformers for [Integreat](https://github.com/integreat-io/integreat) and
[MapTransform](https://github.com/integreat-io/map-transform).

## Transformers

The package consists of several transformers that are exported as an object with
the transformers set as properties:

- [`base64`](#base64)
- [`boolean`](#boolean)
- [`count`](#count)
- [`csv`](#csv)
- [`date`](#date)
- [`hash`](#hash)
- [`lowercase`](#lowercase)
- [`math`](#math)
- [`ms`](#ms)
- [`now`](#now)
- [`number`](#number)
- [`range`](#range)
- [`replace`](#replace)
- [`round`](#round)
- [`split`](#split)
- [`string`](#string)
- [`sum`](#sum)
- [`truncate`](#truncate)
- [`unique`](#unique)
- [`uppercase`](#uppercase)
- [`uriPart`](#uriPart)
- [`xml`](#xml)

_Note:_ Transformers access an object of properties that will change how the
transformer behaves. When defined as transform objects, any property not
prefixed with `$` will be handed to the transformer as its properties. This is
what we refer to in this documentation when we talk about e.g. the `step`
property. We may also refer to the properties as the transformer's "options".

### `base64`

Will decode any base64 string coming _from_ a service, or encode a value with
base64 going _to_ a service.

A non-string value will be treated differenlty depending on the direction:

- When coming _from_ a service, the result will be `undefined` (or `null` if
  `null`)
- When going _to_ a service, the value will be forced to a string if possible,
  in the same way as the `string` transformer. `null` and `undefined` will not
  be touched.

### `base64Encode`

Will base64 encode the value regardless of direction.

### `base64Decode`

Will base64 decode the value regardless of direction.

### `boolean`

Transforms values to boolean by JavaScript rules, except the string `'false'`,
which is transformed to `false`. `null` and `undefined` are not touched.

### `count`

It does what you thing: It counts the values you provide it. An array of eight
items returns `8`, one item (non-array) returns `1`.

By default it will not count `null` or `undefined`, either in an array or as a
non-array item. By providing an array of values to skip in the `skip` property,
you may choose what values to not count.

When you provide your own list, you need to provide `null` and `undefined` in
the list too, for them to be skipped. So to count every value, including `null`
and `undefined`, set `skip: []`.

When defining this as JSON, you may use `**undefined**` in the `skip` list
instead of `undefined`. (`undefined` does not have a literal in JSON.)

### `csv`

This transformer takes a CSV string coming _from_ a service, and returns an
array of data objects. Going _to_ a service, it does the oposite.

Each line in the CSV is converted to an object. When the `headerRow` prop is
`true`, the first line will be treated as headers and thus used as keys on the
object. When there's no header row, keys will be named `'col1'`, `'col2'`, etc.,
in the order they appear in the file. To have something other than `'col'`, set
the `columnPrefix` prop the preferred string.

When generating CSV going _to_ the service, the order of the columns will match
the order of the keys on the object, unless some or all keys match the
`columnPrefix` or the default `'col'`. In this case, the prefixed keys will
be sorted in ascending order by their number, before any other keys.

The transformer handles objects with different keys by leaving columns empty
in the places that other rows has values. The order of the keys will be
determined with priority to its first occurence, so if a field is missing on the
first object in the array, it will be placed after the keys from the first row,
even if it is placed before or in-between them on the object it first appears.

The following options are available:

- `delimiter`: A character to use as delimiter. Default is comma (`,`)
- `quoted`: Signals if the value in CSV columns should be surrounded by quots
  (`"`). This only applies when generating a CSV string (_to_ a service), as
  parsing will handle quots if they appear in the CSV regardless of this option.
  Default is `true`
- `headerRow`: If `true`, the first row will be treated as a header row when
  parsing a CSV _from_ a service, and a header row will be inserted when
  generating a CSV _to_ a service. In both these examples, header row values
  will equal object keys. Default is `false`
- `columnPrefix`: A string to use as the base for creating object keys when we
  don't have a header row. The `columnPrefix` will be suffixed by an
  incrementing number based on the order of the keys on the object, like
  `'col1'`, `'col2'`, etc. When generating CSV, any keys named as this prefix
  and a number, will be sorted accending after the number. Default is `'col'`

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

Date also have a few options for formatting a date (when going to a service), or
parsing a date (when coming from a service), and to modify the date itself
(before formatting or after parsing):

- `path`: A path to a point in the data from where to pick the date value. When
  no path is given, the data in the pipeline is used as is. Default is no path
- `format`: [A Luxon format](https://moment.github.io/luxon/#/parsing?id=table-of-tokens)
  to use for parsing (from service) and formatting (to service), or the string
  `'iso'` as a shortcut to a full ISO8601 date and time format
- `tz`: A timezone to use when the given date is not specified with timezone.
  Supports the same timezones as Luxon, like IANA (`'America/New_York'`), fixed
  offset (`'UTC+7'`) and some others (like `system`).
- `isSeconds`: When `true`, a number will be treated as seconds since epoc,
  instead of milliseconds. Default is `false`.
- `add`: Adds the number of time intervals given by a period object (see below)
  from a service, and subtracts when going to a service.
- `subtract`: Subtracts the number of time intervals given by a period object
  (see below) from a service, and adds when going to a service.
- `set`: Sets a part of the date/time to the value given by an object in the
  same format as a period object (see below). E.g. `{ type: 'day', value: 1 }`
  will return the first in the month from the given date.

A period object has one or more keys refering to a time interval (see valid
keywords below), with the value specifying the number of time intervals (for
`add` and `subtract`) or an absolut value (for `set`). The value may either be
a static number or a path to where in the data the number can be found.

For example:

```javascript
{ month: 6, day: 1 }
```

... or ...

```javascript
{ month: 'settings.numberOfMonths', day: 10 }
```

The available keywords for the keys of a period object are: `year`, `quarter`,
`month`, `week`, `day`, `hour`, `minute`, `second`, and `millisecond`.

### `formatDate`

Formats a date the same way as `date` does, but does it regardless of direction,
i.e. both from and to a service. (`date` parses from a service and formats to
a service.)

See [`date`](#date) for available options.

### `hash`

Will create a url-friendly hash from a given string. `null` and `undefined` will
be untouched, everything else will be forced to a string before hashing.

In the future, this transform may also create hashes of objects, but for now an
object will be the hash of `[object Object]`. :(

### `lowercase`

Any string will be returned in lowercase, all other values will be untouched.

### `math`

Provides the math operations `add`, `subtract`, `multiply` and `divide`.

All operations accept a `value`, which will be used in the operation, e.g.:

- `{ operator: 'add', value: 1 }` will add 1 to the value from the pipeline
- `{ operator: 'subtract', value: 15 }` will subtract 15 from the pipeline value

For the operations where the pipeline value and the operator value is not
exchangable, like subtraction, where `10 - 15` is not the same as `15 - 10`, the
pipeline value will always be the first in the expression. Set the property
`flip` to `true` to reverse this.

By default the transformer will use the value from pipeline, but you may specify
a `path` to get data from an object. Also, as an alternative to specifying the
`value`, you may set a `valuePath`. If both `value` and `valuePath` are set,
`value` will be used as a default value if `valuePath` yields no number.

- The operations works in reverse as well, with `add` subtracting, `multiply`
  dividing, and the other way around
- Set the `rev` property to `true` to "reverse the reversing", i.e. to apply the
  defined operation in reverse, and the oposite operation going forward
- If the pipeline value is a string, an attempt will be made to parse a number
  (float) from it
- If the pipeline value is not a number (or parsed to a number), it will result
  in `undefined`
- If the property `value` is not a number, the pipeline value will be untouched

### `ms`

Will return the milliseconds of a Date since epoc (1970-01-01). Strings and
numbers will first be casted to Date if possible. All other values will yield
`undefined`.

### `now`

Returns the current date, regardless of the pipeline value.

- The date is returned as a JS date, and may for example be transformed with the
  `date` transformer when needed

### `number`

Transforms any given value to a number if possible, or returns `undefined` if
not. Non-numbers are treated like the following:

- Strings are parsed with `parseFloat`
- Booleans are treated JavaScript style: `true` -> `1`, `false` -> `0`
- Dates are transformed to milliseconds since epoc (midnight 1970-01-01)
- `null` and `undefined` are untouched
- All other types will return `undefined`

To round numbers, set the `precision` property to the number of decimals to round
to. When `precision` is not set, the number will not be rounded.

Note that JavaScript rounds towards +∞ for negative numbers where the decimal 5
is rounded away. Other systems may round away from 0 in such cases.

### `range`

Will create an array of numbers from a provided start number to a provided end
number. The start and end numbers may be provided with the `start` and `end`
properties to specify the numbers directly, or with `startPath` and `endPath` to
retrieve the numbers from the pipeline data. If paths yield no number, the
non-path prop will be used as a default.

By default, the numbers will be every integer (given that the start is an
integer), i.e. a step of `1` between each number. You may specify different
steps directly with the `step` property or from the data with the `stepPath`
property.

Finally, you may set `includeEnd` to a boolean value to indicate whether you
would like the end number to be included in the array if the last step "lands"
on the end. (In other words, it is included if the difference between start and
end is an exact product of step.) The default is `false`, i.e. the end will not
be included.

If start and end is missing or not a number, or if a step is a non-number value,
the result of `range` will be `undefined`.

### `replace`

Will replace the `from` property with the `to` property in the given string value.
If the value is not a string, it will be passed on untouched.

### `round`

Will round the pipeline value to the given `precision`. Default precision is
`0`, i.e. rounding to integer. `precision` may also be set to `floor` or `ceil`,
in order to always round up or down to the next integer.

- Strings are parsed to a float if possible
- Rounding is always done away from zero by default, i.e. -3.5 will be rounded
  to -4, and not -3. This may be change to rounding towards +∞ by setting
  the `roundTowardsInfinity` property to `true`
- `floor` and `ceil` is not affected by the `roundTowardsInfinity` property, and
  `floor` will always be away from +∞ and `ceil` towards +∞. This might change
  in the future

### `split`

**Forward:** Will split the given value when it makes sense to do so:

- A string will be split into an array of segments by the given `size` property
- A number will be converted to a string, and segmented as a string
- An array will be split into an array of subarrays by the given `size`

All other types will be left untouched, but we may add new ways to split values
in the future.

As an alternative to giving a split size in the `size` property, the `sizePath`
property will get its value from the pipeline. If both `size` and `sizePath` are
given, `size` will work as a default value when `sizePath` returns no number. If
none of these are given, `split` will not split.

Provide a `path` property to get a value at a path from the data, instead of
using the data directly.

**Reverse:** An array will be joined, either by concatinating strings or joining
arrays. If not an array, the value will be returned untouched.

### `string`

Transforms any given value to a string, according to normal JavaScript behavior,
except:

- Numbers and booleans are forced to a string, so `3` becomes `'3'` and `true`
  becomes `'true'`
- Dates are transformed to an ISO string like `'2019-05-22T13:43:11.345Z'`
- Objects are transformed to `undefined`
- `null` and `undefined` are untouched

### `sum`

Adds an array of numbers. Will parse numbers from strings, but skip all other
values. If not an array, it will be treated as an array of one element. Note
that this transformer always returns a number, even `null` and `undefined` will
yield `0`.

### `truncate`

When a `length` property is set, a given string that is longer than this length
is shortened. If a `postfix` is given, it is appended to the end and the total
length of the shortened text will still be no longer than `length`.

### `unique`

Generates a universally unique id. The incoming value is disregarded.

Set the `type` property to indicate what type of id you want, or omit it to get
`nanoid`:

- `nanoid` (default): A small (130 bytes) string generated with
  [`nanoid`](https://github.com/ai/nanoid). Uses the letters `A-Za-z0-9_-`
- `uuid` or `uuidLower`: A RFC4122 version 4 id in lowercase, e.g.
  `'9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'`, generated with
  [`uuid`](https://github.com/uuidjs/uuid)
- `uuidUpper`: A RFC4122 version 4 id in uppercase, e.g.
  `'9B1DEB4D-3B7D-4BAD-9BDD-2B0D7B3DCB6D'`, generated with
  [`uuid`](https://github.com/uuidjs/uuid)

### `uppercase`

Any string will be returned in uppercase, all other values will be untouched.

### `uriPart`

Will uri decode going forward (from a service) and uri encode in reverse (going
to a service). The uri encoding is done by replacing each instance of certain
characters by one, two, three, or four escape sequences representing the UTF-8
encoding of the character. It is intended for encoding e.g. query param values,
so characters allowed other places in urls will also be encoded, like `:`, `\`,
and `&`.

Values are forced to a string or `undefined` by the rules mentioned under
[`string`](#string).

### `xml`

**Forward (coming from a service):** An XML string will be parsed and returned
as a JS object structure.

**Reverse (going to a service):** The value will be stringified as an XML string
using the same rules as when parsing.

The rules behind parsing (and stringifying) is:

- An XML document will be parsed to an object with the name of the root element
  as a prop. Node/elements are themselves represented by objects.
- A node/element will be set as a property on the object of its parent node,
  with its name as key.
- An attribute will be set as a property on the object of its containg element,
  with its name prefixed with `'@'` as key.
- A list of equally named child elements will be set as an array of one object
  for each element, and this array is set as a property on its parent element
  in the same way as single child elements.
- A value node (plain value) is set on the object of its parent element with
  the key `$value`. This is done this way because elements with a value may
  still have attributes. When stringifying, we treat both an object with a
  `$value` prop and a plain value as value nodes.
- Prefixes are included in the props as if they where part of the element or
  attribute name, but there will be a normalization of prefixes and it's
  possible to provide a dictionary of prefixes on the `namespaces` property (see
  below).
- When parsing, encoded chars (e.g. `'&lt;'` or `'&#230;'`) will be decoded
  (e.g. `'<'` or `'æ'`). When stringifying, all UTF-8 chars and reserved XML
  chars (`'<>&'`) will be encoded.

The `namespaces` property may be an object with uris as keys and prefixes as
values. Any namespace matching an uri will use the given prefix. Use an empty
string `''` to indicate a default namespace that will not have any prefix.
