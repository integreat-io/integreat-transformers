# Integreat transformers

Core transformers for [Integreat](https://github.com/integreat-io/integreat) and
[MapTransform](https://github.com/integreat-io/map-transform).

[![npm Version](https://img.shields.io/npm/v/integreat-transformers.svg)](https://www.npmjs.com/package/integreat-transformers)
[![Maintainability](https://api.codeclimate.com/v1/badges/dfebac9f3541a519ccab/maintainability)](https://codeclimate.com/github/integreat-io/integreat-transformers/maintainability)

## Prerequisits

Requires node v18 and Integreat v1.0.

## Transformers

The package consists of several transformers that are exported as an object with
the transformers set as properties:

- [`absolute`](#absolute)
- [`arrToObject`](#arrtoobject)
- [`base64`](#base64)
- [`boolean`](#boolean)
- [`count`](#count)
- [`csv`](#csv)
- [`date`](#date)
- [`dedupe`](#dedupe)
- [`extractNumber`](#extractNumber)
- [`exclude`](#exclude)
- [`formatDate`](#formatDate)
- [`hash`](#hash)
- [`htmlDecode`](#htmlDecode)
- [`htmlEntities`](#htmlEntities)
- [`integer`](#integer)
- [`join`](#join)
- [`lowercase`](#lowercase)
- [`math`](#math)
- [`ms`](#ms)
- [`now`](#now)
- [`number`](#number)
- [`objectToArr`](#objecttoarr)
- [`parse`](#parse)
- [`pattern`](#pattern)
- [`range`](#range)
- [`replace`](#replace)
- [`round`](#round)
- [`size`](#size)
- [`split`](#split)
- [`string`](#string)
- [`sum`](#sum)
- [`template`](#template)
- [`trim`](#trim)
- [`truncate`](#truncate)
- [`unique`](#unique)
- [`uppercase`](#uppercase)
- [`uriPart`](#uripart)
- [`validate`](#validate)

**Note on properties:** Transformers use properties to define their
behavior. If an object is defined as a transformer, any property not
prefixed with `$` will become one of the transformer's properties.
For example, the `step` or `path` properties. These properties will
often be referred to as a transformer's "options", in the documentation.

**Note on direction:** Some transformers behave differently depending on
whether we are transforming data _from_ a service or _to_ a service. This
behavior will be described underneath each transformer (or just below this
section). In many cases there is a transformer with oposite functionality
for the reverse direction. However, flipped mutation objects will also flip
this behavior, and making the transformer work as the oposite direction.
This will feel natural when you write configs, even though it might be
confusing when reading the documentation.

### `absolute`

Returns the absolute value (i.e. distance from zero) of a `number`.  If the
input is not a number, `undefined` is returned instead.

### `arrToObject`

**Forward:** Sets the values from an array as props on an object. The prop names
are given as an array in the `keys` property, and are matched in the same order
as the values in the pipeline value. Values in the array without corresponding
`keys` will be skipped.

**Reverse:** Explodes the props of an object to an array of its values, in the
order of the keys given in an array of keys on the `keys` property. Keys on the
object not included in `keys` will be skipped.

In a flipped mutation object, the direction of this transformer is also
flipped.

### `base64`

Will decode any base64 string coming _from_ a service, or encode a value with
base64 going _to_ a service. In a flipped mutation object, the directions are
also flipped.

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

In a flipped mutation object, the direction of this transformer is also
flipped.

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
  and a number, will be sorted accending after the number. Default is `'col'
- `direction`: By default, the `csv` transformer will generate CSV going _to_ a
  service (and parsing CSV _from_ a service). By setting `direction: 'from'`,
  this will be reversed, generating a CSV _from_ a service instead. The default
  is `direction: 'to'`.

### `date`

Going forward – from a service, `date` will try its best at transforming the
given value to a date, or it returns `undefined`. In reverse – to a service, it
will format the date according to a given `format`.

In a flipped mutation object, the direction of this transformer is also
flipped.

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
  same format as a period object (see below). E.g. `{ day: 1 }` will return the
  first in the month from the given date.

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

### `dedupe`

Removes duplicates from an array. Only the first item that is a match will be
kept. Any value that is `undefined` will not count as unique and will be removed.

For example:

```javascript
const data = [undefined, 'first', 'first', 'second', 0, 1, 2, 2, null]
```

will return:

```javascript
const result = ['first', 'second', 0, 1, 2, null]
```

Dedupe can recieve a path property which removes duplicates based on an embedded
values.

An array of:

```javascript
const data = [
  undefined,
  'undefined due to no path',
  { month: 6, day: 1 },
  { month: 6, day: 1 },
  { month: 6, day: 2 },
  { month: 7, day: 1 },
  { month: 8, day: 2 },
]
```

and a path of `month` returns:

```javascript
const result = [
  { month: 6, day: 1 },
  { month: 7, day: 1 },
  { month: 8, day: 2 },
]
```

**Note:** The objects are considered instances. When comparing 2 objects
with the same structure both will be kept. When comparing a primitive type
within objects, using a path, all duplicates will be remove. This may be changed
in the future.

### `extractNumber`

Extracts all digits from a string and returns a them as a `number`.  If a `number`
is provided it will remain unchanged.  All other types are returned as `undefined`.

### `exclude`

Exclude items from an array at `path` when they are also in the array at
`excludePath`.

If either of the paths points to a value instead of an array, it will first be
put in an array. E.g. when `path` is a string that is found in the `excludePath`
array, an empty array will be returned. When there's no data at either of the
paths, an empty array is used.

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

### `htmlDecode`

Will decode a string with HTML entities going forward (from a service), and
encode in reverse (going to a service). This transformer is not affected by
being inside a flipped mutation object, and will decode from and encode to a
service regardless.

Example: When we get `'foo &copy; bar &#8800; baz &#x1D306; qux'` from a
service, this transformer will turn it into `'foo © bar ≠ baz 𝌆 qux'`,
and vica versa.

We are using [the `he` package]{https://github.com/mathiasbynens/he} under
the hood, with named references enabled and hexadecimal escapes. This means
that `'©'` will be encoded as `'&copy;'`, as there exists a named reference,
while any special char without a named reference, like `'𝌆'` will be encode
with its character reference as a hexadecimal number (e.g. `'&#x1D306;'`).
When decoding, all variants are allowed.

Values are forced to a string or `undefined` by the rules mentioned under
[`string`](#string).

### `htmlEncode`

Will encode a string with HTML entities going forward (from a service), and
decode in reverse (going to a service). This is the oposite of
[`htmlDecode`](#htmlDecode), so see that transformer for more details.

### `htmlEntities`

This is an alias for [`htmlDecode`](#htmlDecode), kept for backward
compatability.

### `integer`

Cast the given value to an integer when possible. This is just a shortcut for
the `number` transformer with `precision: 0`, so refer to
[its documentation](#number) for more details.

### `join`

This transformer works exactly as the [`split`](#split) transformer, expect that
the direction is reversed, so refer to [its documentation](#split) below.

In a flipped mutation object, the direction of this transformer is also
flipped.

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
  defined operation in reverse, and the oposite operation going forward. This
  will also be the case in a flipped mutation object (not to be confused with
  the `flip` property of this transfomrer).
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

### `objectToArr`

**Forward:** Explodes the props of an object to an array of its values, in the
order of the keys given in an array of keys on the `keys` property. Keys on the
object not included in `keys` will be skipped.

**Reverse:** Sets the values from an array as props on an object. The prop names
are given as an array in the `keys` property, and are matched in the same order
as the values in the pipeline value. Values in the array without corresponding
`keys` will be skipped.

In a flipped mutation object, the direction of this transformer is also
flipped.

### `parse`

Will parse with a template coming __from__ a service. This is the oposite of the
[`template` transformer](#template), so see it's documentation for more details.

### `pattern`

Will return `true` or `false` depending on whether the provided regex `pattern`
matches the data in the pipeline or at the path `path`. If no pattern is
provided, the result is always `false`. If the value is not a string, the result
is always `false`.

You may set the flag `caseinsensitive` to `true` to have a case insensitive
match.

This transformer works the same in both directions.

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

Will replace the `from` property with the `to` property in the given string
value in data _from_ a service, and the other way around in data going _to_ a
service. In a flipped mutation object, this behavior is reversed.

If the value is not a string, it will be passed on untouched.

### `round`

Will round the pipeline value to the given `precision`. Default precision is
`0`, i.e. rounding to integer. `precision` may also be set to `floor` or `ceil`,
in order to always round up or down to the next integer.

- Strings are parsed to a float if possible
- If the value is equally distant from the closest value in both directions, the
  value furthest away from zero will be selected by default, e.g. -3.5 will be
  rounded to -4, and not -3. This behavior can be changed to rounding towards
  +∞ by setting the `roundTowardsInfinity` property to `true`.
- `floor` and `ceil` is not affected by the `roundTowardsInfinity` property, and
  `floor` will always be away from +∞ and `ceil` towards +∞.

### `size`

The `size` transformer returns the length of the value in the pipeline,
regardless of direction, in the following ways:

- String: Number of characters
- Number: Number of characters after converting the number to a string
- Array: Number of items (including items that are undefined)
- Null and undefined: 0
- Everything else: 1

### `split`

**Forward:** Will split the given value if it can be split:

- A string will be split into an array of segments by the given `size` property
  or by the character given by `sep`. When no `size` or `sep` is given, the
  string will be split at each space (`' '`)
- A number will be converted to a string, and segmented as a string
- An array will be split into an array of subarrays by the given `size`

All other types will be left untouched, but we may add new ways to split values
in the future.

As an alternative to giving a split size in the `size` property, the `sizePath`
property will get its value from the pipeline. If both `size` and `sizePath` are
given, `size` will work as a default value when `sizePath` returns no number. In
the same way, `sepPath` will get the separator char from the data at the given
path, with `sep` as a default value.

Provide a `path` property to get a value at a path from the data, instead of
using the data directly.

**Reverse:** An array will be joined, either by concatinating strings or joining
arrays. When concatinating string, the `sep` or `sepPath` character will be
used as a separator. If not an array, the value will be returned untouched.

In a flipped mutation object, the direction of this transformer is also
flipped.

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

### `template`

Takes the template in the `template` property and applies it to the data in the
pipeline, replacing `{{path}}` with the value given at the path. `path` is just
an example here, so replace it with your actual path. Only simple dot notation
paths are allowed, no parents or roots etc. The value will be html encoded by
default, and you may use tripple curly brackets `{{{path}}}` to replace the
value without any encoding.

When going in reverse, or in a flipped mutation, `template` will instead parse
the values in the positions that is otherwise replaced, and set them on the
respective paths, replacing the pipeline value. All values will be strings, as
it not possible to know if a number is supposed to be a number. Note also that
the transformer will do its best, but there might be cases where it is
impossible to match the template to the actual value. We plan to support "hints"
in the template in a future version, to be able to provide help for these hard
cases.

Example of a template: `'User {{id}} is called {{details.name}}'`

The template may alternatively be provided in the pipeline data, with the
`templatePath` prop pointing at it. The template will then be extracted at
runtime. If no template is found at the path, the transformer returns
`undefined`. `templatePath` may be a full pipeline.

`template` also have a reversed transformer [`parse`](#parse), that behaves in
the same way, but for the oposite direction.

### `trim`

Will trim whitespace from the beginning and end of a string, or return it
untouched if it's not a string.

### `truncate`

When a `length` property is set, a given string that is longer than this length
is shortened. If a `postfix` is given, it is appended to the end and the total
length of the shortened text will still be no longer than `length`.

### `unique`

Generates a universally unique id. The incoming value is disregarded.

Set the `type` property to indicate what type of id you want, or omit it to get
`nanoid`:

- `nanoid` (default): A small 21 character string generated with
  [`nanoid`](https://github.com/ai/nanoid). Uses the letters `A-Za-z0-9_-`.
- `alpha`: Also a [`nanoid`](https://github.com/ai/nanoid) string, but with
  the letters `A-Za-z0-9` -- no hyphen or underscore. This reduces the
  probability for collisions a bit, but only slightly.
- `uuid` or `uuidLower`: A RFC4122 version 4 id in lowercase, e.g.
  `'9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'`, generated with
  [`uuid`](https://github.com/uuidjs/uuid).
- `uuidUpper`: A RFC4122 version 4 id in uppercase, e.g.
  `'9B1DEB4D-3B7D-4BAD-9BDD-2B0D7B3DCB6D'`, generated with
  [`uuid`](https://github.com/uuidjs/uuid).

### `uppercase`

Any string will be returned in uppercase, all other values will be untouched.

### `uriPart`

Will uri decode going forward (from a service) and uri encode in reverse (going
to a service). This transformer is not affected by being in flipped mutation
object, and will decode from and encode to a service either way.

The uri encoding is done by replacing each instance of certain
characters by one, two, three, or four escape sequences representing the UTF-8
encoding of the character. It is intended for encoding e.g. query param values,
so characters allowed other places in urls will also be encoded, like `:`, `\`,
and `&`.

Values are forced to a string or `undefined` by the rules mentioned under
[`string`](#string).

### `validate`

This is a transformer for validating the value at a `path` against a
[JSON Schema](http://json-schema.org/). We won't go into details of JSON Schema
here, and the `validate` transformer simply retrieves the value at the path and
validates it according to the provided schema.

Note that if you provide a schema that is always valid, it will be valid even
when the data has no value at the given path.
