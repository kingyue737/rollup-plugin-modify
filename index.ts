import MagicString from 'magic-string'
import { createFilter } from '@rollup/pluginutils'
import type { Plugin } from 'rollup'

type ReplaceFunction = (match: string, path: string) => string

interface RollupModifyOptions {
  [key: string]:
    | RollupModifyOptions['find']
    | RollupModifyOptions['replace']
    | RollupModifyOptions['sourcemap']
    | RollupModifyOptions['exclude']
  find: string | RegExp
  replace: string | ReplaceFunction
  sourcemap?: boolean
  include?: string | string[]
  exclude?: string | string[]
}

const escapeRegExp = (x: string) => x.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')

const regexPlugin: (options: RollupModifyOptions) => Plugin = function ({
  find,
  replace,
  include,
  exclude,
  sourcemap = true,
  ...rest
}) {
  const modifiers: [RegExp, string | ReplaceFunction][] = (
    [[find, replace], ...Object.entries(rest)] as [
      string | RegExp,
      string | ReplaceFunction
    ][]
  )
    .filter((x) => x[0])
    .map(([find, replace]) => [parseFind(find), replace])
  const filter = createFilter(include, exclude)

  return {
    name: 'modify',
    enforce: 'pre',
    transform: (source, id) => {
      if (!filter(id)) return null

      if (modifiers.every((x) => !x[0]?.test(source))) return

      const s = new MagicString(source)

      modifiers.forEach(([find, replace]) => {
        find.lastIndex = 0
        let match
        while ((match = find.exec(source)) !== null) {
          s.overwrite(
            match.index,
            match.index + match[0].length,
            typeof replace === 'function'
              ? replace.apply(null, match)
              : String(replace)
          )
        }

        return s
      })

      return {
        code: s.toString(),
        map: sourcemap ? s.generateMap() : null,
      }
    },
  }

  function parseFind(find: string | RegExp) {
    if (find instanceof RegExp)
      return new RegExp(
        find,
        find.flags + (find.flags.includes('g') ? '' : 'g')
      )

    const regex = find.match(/^\/(.*)\/([yumgis]*)$/)
    return regex
      ? new RegExp(regex[1], regex[2] + (regex[2].includes('g') ? '' : 'g'))
      : new RegExp(escapeRegExp(find), 'g')
  }
}

export default regexPlugin
