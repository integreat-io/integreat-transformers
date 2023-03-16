import { Transformer } from 'integreat'
import Mustache = require('mustache')
import mapAny = require('map-any')
import { defToDataMapper } from 'map-transform/definitionHelpers.js'
// import { Path, DataMapper, Options, TransformerProps } from '../types.js'

interface Props extends Record<string, unknown> {
  template?: string
  templatePath?: string
}

function parseAndCreateGenerator(templateStr: string) {
  Mustache.parse(templateStr) // Mustache will keep the parsed template in a cache
  return (data: unknown) =>
    mapAny((data: unknown) => Mustache.render(templateStr, data), data)
}

const transformer: Transformer = function template({
  template: templateStr,
  templatePath,
}: Props) {
  if (typeof templateStr === 'string') {
    // We already got a template -- preparse it and return a generator
    return parseAndCreateGenerator(templateStr)
  } else if (typeof templatePath === 'string') {
    // The template will be provided in the data -- return a function that will
    // both create the generator and run it
    const getFn = defToDataMapper(templatePath)

    return (data, state) => {
      const templateStr = getFn(data, { ...state, rev: false, flip: false })
      if (typeof templateStr === 'string') {
        return parseAndCreateGenerator(templateStr)(data)
      }
      return undefined
    }
  }

  return () => undefined
}

export default transformer
