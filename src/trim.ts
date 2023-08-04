import type { Transformer } from 'integreat'

const trim: Transformer = () => () => (value, _context) =>
  typeof value === 'string' ? value.trim() : value

export default trim
