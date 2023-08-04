import { nanoid } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'
import type { Transformer } from 'integreat'

export interface Props {
  type?: string
}

const transformer: Transformer =
  ({ type }: Props) =>
    () =>
      function unique(): string | undefined {
        switch (type) {
          case 'uuid':
          case 'uuidLower':
            return uuidv4()
          case 'uuidUpper':
            return uuidv4().toUpperCase()
          case 'nanoid':
          default:
            return nanoid()
        }
      }

export default transformer
