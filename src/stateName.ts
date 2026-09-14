import mapAny from 'map-any'
import xor from './utils/xor.js'
import normalizeName from './utils/normalizeName.js'
import states from './utils/states.js'
import type { Transformer } from 'map-transform/types.js'

const stateNames = new Map(Object.entries(states))

// The reverse lookup table is only built the first time it is needed. A name
// shared by more than one code is set to `null`, so that we don't guess.
let reverseTable: Map<string, string | null> | undefined

function buildReverseTable() {
  const table = new Map<string, string | null>()
  for (const [code, name] of stateNames) {
    const key = normalizeName(name)
    table.set(key, table.has(key) ? null : code)
  }
  return table
}

function getReverseTable() {
  if (!reverseTable) {
    reverseTable = buildReverseTable()
  }
  return reverseTable
}

function getStateName(value: unknown) {
  return typeof value === 'string'
    ? stateNames.get(value.trim().toUpperCase())
    : undefined
}

function getStateCode(value: unknown) {
  return typeof value === 'string'
    ? (getReverseTable().get(normalizeName(value)) ?? undefined)
    : undefined
}

const toName = mapAny(getStateName)
const toCode = mapAny(getStateCode)

const transformer: Transformer = () => () => (value, state) =>
  xor(state.rev, state.flip) ? toCode(value) : toName(value)

export default transformer
