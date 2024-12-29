import Mustache from 'mustache'
import mapAny from 'map-any'
import mapTransform from 'map-transform'
import { defToDataMapper } from 'map-transform/definitionHelpers.js'
import htmlEntities from './htmlEntities.js'
import xor from './utils/xor.js'
import { isNullOrUndefined } from './utils/is.js'
import type { AsyncTransformer } from 'integreat'
import type { DataMapper } from 'map-transform/types.js'

interface Props extends Record<string, unknown> {
  template?: string
  templatePath?: string
}

interface Param {
  path: string
  encode: boolean
}

function parseAndCreateGenerator(templateStr: string) {
  Mustache.parse(templateStr) // Mustache will keep the parsed template in a cache
  return async (data: unknown) =>
    mapAny((data: unknown) => Mustache.render(templateStr, data))(data)
}

const templateRegex = /(\{\{\{?.*?\}?\}\})/

function parseParam(param: string) {
  const isTripleBrackets = param.startsWith('{{{') && param.endsWith('}}}')
  const path = isTripleBrackets ? param.slice(3, -3) : param.slice(2, -2)
  return { path, encode: !isTripleBrackets }
}

/**
 * Split the template into parts with the string parts as strings and the params
 * as objects with a `path` property.
 */
function prepareTemplate(template: string): (string | Param)[] {
  const parts = template.split(templateRegex)
  const compiled = parts.map((part, index) =>
    index % 2 === 1 ? parseParam(part) : part,
  )
  return compiled[compiled.length - 1] === '' ? compiled.slice(0, -1) : compiled // Remove the last element if it's an empty string
}

/**
 * Parse the individual param values from a string with the given template
 * parts, and set them on back on the paths in the respective param positions.
 */
async function parseFromTemplate(data: unknown, parts: (string | Param)[]) {
  let target: unknown = undefined
  if (typeof data === 'string') {
    let startIndex = -1
    let nextSetter: DataMapper | null = null
    for (const part of parts) {
      if (typeof part === 'string') {
        // This is a string part, so find where it starts
        const nextIndex = data.indexOf(part, startIndex)
        if (nextIndex === -1) {
          // The string was not found -- stop here
          break
        }
        if (nextSetter) {
          // We have already passed a param, so get the value from the end of
          // the last string to the beginning of this one, and set it on the
          // target with the setter.
          const value = data.slice(startIndex, nextIndex)
          target = await nextSetter(value, { target, value, context: [] })
          nextSetter = null // We're ready for a new param
        }

        // Set the end of this string as the start point for the next param
        // value.
        startIndex = nextIndex + part.length
      } else {
        // This is a param part. Prepare a setter that will set the value on the
        // target when we get to the next string.
        nextSetter = mapTransform([
          ...(part.encode ? [{ $transform: htmlEntities({}) }] : []), // Html decode values when they would have been encoded
          `>${part.path}`,
        ])
      }
    }
    if (nextSetter) {
      // There's one more setter here, so let's extract the rest of the string
      // and set it on the target.
      const value = data.slice(startIndex)
      target = await nextSetter(value, { target, value, context: [] })
    }
  }
  return target
}

const transformer: AsyncTransformer = function template({
  template: templateStr,
  templatePath,
}: Props) {
  if (typeof templateStr === 'string') {
    // We already got a template -- preparse it and return a generator
    const generator = parseAndCreateGenerator(templateStr)
    const parts = prepareTemplate(templateStr)
    return () => async (data, state) => {
      if (isNullOrUndefined(data)) {
        data = {}
      }
      const isRev = xor(state.rev, state.flip)
      return isRev ? await parseFromTemplate(data, parts) : generator(data)
    }
  } else if (typeof templatePath === 'string') {
    // The template will be provided in the data -- return a function that will
    // both create the generator and run it
    const getFn = defToDataMapper(templatePath)

    return () => async (data, state) => {
      const isRev = xor(state.rev, state.flip)
      if (isRev) {
        return data
      }

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
