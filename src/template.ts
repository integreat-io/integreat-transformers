import Mustache from 'mustache'
import mapAny from 'map-any'
import { defToDataMapper } from 'map-transform/definitionHelpers.js'
import type { AsyncTransformer } from 'map-transform/types.js'

interface Props extends Record<string, unknown> {
  template?: string
  templatePath?: string
}

function parseAndCreateGenerator(templateStr: string) {
  Mustache.parse(templateStr) // Mustache will keep the parsed template in a cache
  return async (data: unknown) =>
    mapAny((data: unknown) => Mustache.render(templateStr, data))(data)
}

const transformer: AsyncTransformer = function template({
  template: templateStr,
  templatePath,
}: Props) {
  if (typeof templateStr === 'string') {
    // We already got a template -- preparse it and return a generator
    return () => parseAndCreateGenerator(templateStr)
  } else if (typeof templatePath === 'string') {
    // The template will be provided in the data -- return a function that will
    // both create the generator and run it
    const getFn = defToDataMapper(templatePath)

    return () => async (data, state) => {
      const templateStr = await getFn(data, {
        ...state,
        rev: false,
        flip: false,
      })
      if (typeof templateStr === 'string') {
        return parseAndCreateGenerator(templateStr)(data)
      }
      return undefined
    }
  }

  return () => async () => undefined
}

export default transformer
