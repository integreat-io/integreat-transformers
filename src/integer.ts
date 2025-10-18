import number from './number.js'
import type { Transformer } from 'map-transform/types.js'

export type Props = Record<string, unknown>

const transformer: Transformer = (_prop: Props) => number({ precision: 0 })

export default transformer
