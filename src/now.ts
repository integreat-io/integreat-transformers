import type { Transformer } from 'integreat'

const transformer: Transformer = () => () => () => new Date()

export default transformer
