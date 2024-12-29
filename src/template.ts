import mapAny from 'map-any/async.js'
import mapTransform from 'map-transform'
import { defToDataMapper } from 'map-transform/definitionHelpers.js'
import { htmlEncode } from './htmlEntities.js'
import xor from './utils/xor.js'
import type { AsyncTransformer } from 'integreat'
import type { DataMapper, State } from 'map-transform/types.js'

interface Props extends Record<string, unknown> {
  template?: string
  templatePath?: string
}

const templateRegex = /(\{\{\{?.*?\}?\}\})/

/**
 * Extract the path from the param and return a DataMapper to get or set its
 * value when we generate or parse from the template later. If the param is
 * given with two brackets, we HTML encode/decode, if it has three brackets, we
 * use it as it is.
 */
function parseParam(param: string) {
  const isTripleBrackets = param.startsWith('{{{') && param.endsWith('}}}')
  const path = isTripleBrackets ? param.slice(3, -3) : param.slice(2, -2)
  return mapTransform([
    path,
    ...(isTripleBrackets ? [] : [{ $transform: htmlEncode({}) }]), // HTML encode/decode if we don't have three brackets
  ])
}

/**
 * Remove the last part if it is an empty string.
 */
const removeTrailingEmptyString = (parts: (string | DataMapper)[]) =>
  parts[parts.length - 1] === '' ? parts.slice(0, -1) : parts

/**
 * Split the template into parts and return a generate and a parse function
 */
function prepareTemplate(template: string) {
  const parts = template.split(templateRegex)
  const compiled = removeTrailingEmptyString(
    parts.map((part, index) => (index % 2 === 1 ? parseParam(part) : part)),
  )

  return {
    generate: mapAny(async (item) => generateFromTemplate(item, compiled)),
    parse: mapAny(async (item) => parseFromTemplate(item, compiled)),
  }
}

/**
 * Generate a string from the given template, by replacing params with values
 * extracted from the data.
 */
async function generateFromTemplate(
  data: unknown,
  template: (string | DataMapper)[],
) {
  const target: string[] = []
  for (const part of template) {
    if (typeof part === 'string') {
      // A string part -- just push it to the target
      target.push(part)
    } else {
      // A param part -- retrieve the value from the data and push it
      const value = await part(data)
      if (value) {
        target.push(String(value))
      }
    }
  }

  // Join all the parts together as one string
  return target.join('')
}

/**
 * Parse the individual param values from a string with the given template
 * parts, and set them on back on the paths in the respective param positions.
 */
async function parseFromTemplate(
  data: unknown,
  template: (string | DataMapper)[],
) {
  let target: unknown = undefined
  if (typeof data === 'string') {
    let startIndex = -1
    let nextSetter: DataMapper | null = null
    for (const part of template) {
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
          target = await nextSetter(value, {
            target,
            value,
            context: [], // The context has no meaning here, but need to be set
            rev: true, // Run in reverse to make this act as a setter
          })
          nextSetter = null // We're ready for a new param
        }

        // Set the end of this string as the start point for the next param
        // value.
        startIndex = nextIndex + part.length
      } else {
        // This is a param part, so we'll just retrieve the setter function
        // provided here. It will work as a setter, as we will run it in reverse
        // when we use it.
        nextSetter = part
      }
    }
    if (nextSetter) {
      // There's one more setter here, so let's extract the rest of the string
      // and set it on the target.
      const value = data.slice(startIndex)
      target = await nextSetter(value, {
        target,
        value,
        context: [],
        rev: true,
      })
    }
  }
  return target
}

/**
 * Run the `generate` function on the `data` if the `state` tells us we're going
 * forward, or the `parse` function if we're going in reverse.
 */
async function parseOrGenerate(
  data: unknown,
  state: State,
  generate: (value: unknown) => Promise<string>,
  parse: (value: unknown) => Promise<unknown>,
) {
  const isRev = xor(state.rev, state.flip)
  return isRev ? await parse(data) : await generate(data)
}

/**
 * The `template` transformer will generate a string from the given template
 * when we're going forward and will try to parse values from the string
 * according to the template in reverse.
 *
 * As an alternative, you may use a template from the data by setting the
 * `templatePath` to a path pointing at it. This can be a full pipeline.
 */
const transformer: AsyncTransformer = function template({
  template: templateStr,
  templatePath,
}: Props) {
  if (typeof templateStr === 'string') {
    // We already got a template -- prepare generate and parse functions
    const { generate, parse } = prepareTemplate(templateStr)

    return () => async (data, state) => {
      return parseOrGenerate(data, state, generate, parse)
    }
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
        const { generate, parse } = prepareTemplate(templateStr)
        return parseOrGenerate(data, state, generate, parse)
      }
      return undefined
    }
  }

  return () => async () => undefined
}

export default transformer
