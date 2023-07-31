import type { Transformer } from 'map-transform/types.js'

const transformer: Transformer = () => () => () => new Date()

export default transformer
