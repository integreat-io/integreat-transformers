import crypto from 'crypto'
import type { Transformer } from 'integreat'

const replaceRegex = /[+/=]/g

const replaceReserved = (hash: string) => {
  return hash.replace(replaceRegex, (match: string) => {
    switch (match) {
      case '+':
        return '-'
      case '/':
        return '_'
      case '=':
        return '~'
      default:
        return match
    }
  })
}

const hash: Transformer = () => () =>
  function hash(value) {
    if (value === null || value === undefined || value === '') {
      return value
    }
    const hasher = crypto.createHash('sha256')
    const hash = hasher.update(String(value)).digest('base64')
    return replaceReserved(hash)
  }

export default hash
