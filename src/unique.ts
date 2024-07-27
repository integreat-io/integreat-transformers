import { nanoid, customAlphabet } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'
import type { Transformer } from 'integreat'

export interface Props {
  type?: string
}

const alphaChars =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

const transformer: Transformer =
  ({ type }: Props) =>
  () =>
    function unique(): string | undefined {
      switch (type) {
        case 'uuid':
        case 'uuidLower':
          // Generate UUID in lowercase
          return uuidv4()
        case 'uuidUpper':
          // Generate UUID in uppercase
          return uuidv4().toUpperCase()
        case 'alpha':
          // Generate nanoid with only alphanumerical chars
          return customAlphabet(alphaChars, 21)()
        case 'nanoid':
        default:
          // Generate standard nanoid with alphanumerical, hyphen, and underscore
          return nanoid()
      }
    }

export default transformer
