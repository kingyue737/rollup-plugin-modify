[![version](https://img.shields.io/npm/v/rollup-plugin-regexp.svg)]() [![license](https://img.shields.io/github/license/porsager/rollup-plugin-regexp.svg)]()

# 🔎 `rollup-plugin-regexp`

Modify rollup output with find / replace dynamically.

## Usage

```bash
pnpm add rollup-plugin-regexp -D
```

Explicit single using find, replace keys

```js
import regexpPlugin from 'rollup-plugin-regexp'

export default {
  plugins: [
    regexpPlugin({
      find: String | RegExp,
      replace: String | Function,
    }),
  ],
}
```

Terse multiple using key, value

```js
import regexpPlugin from 'rollup-plugin-regexp'

export default {
  plugins: [
    regexpPlugin({
      'find this text': 'replace with this here',
      'process.env.PORT': 5000,
    }),
  ],
}
```

### `find: String|RegExp`

Supply a string or RegExp to find what you are looking for

### `replace: String|Function`

Supply a string to directly replace what you've found, or a function to dynamically modify your findings

#### Example using String for both find and replace

```js
regexpPlugin({
  find: 'eval',
  replace: 'lava',
})
```

#### Example using RegExp for find and a Function for replace

```js
regexpPlugin({
  find: /svg\((.*?)\)/,
  replace: (match, path) => JSON.stringify(fs.readFileSync(path, 'utf8')),
})
```
