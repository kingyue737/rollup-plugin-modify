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

export default function modify(options: RollupModifyOptions): Plugin