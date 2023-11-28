import { expect, test } from 'vitest'
import plugin from '../src/index'

test('find replace string', async () => {
  const { transform } = plugin({
    find: 'this',
    replace: 'that',
  })
  const result = transform('replace this here', '')
  expect(result.code).toBe('replace that here')
})

test('find replace regex', () => {
  const { transform } = plugin({
    find: /this/m,
    replace: 'that',
  })

  const result = transform('replace this here this there', '')
  expect(result.code).toBe('replace that here that there')
})

test('find replace regex function', () => {
  const { transform } = plugin({
    find: /this/,
    replace: (m) => m.split('').reverse().join(''),
  })

  const result = transform('replace this here this there', '')
  expect(result.code).toBe('replace siht here siht there')
})

test('key, value', () => {
  const { transform } = plugin({ wat: 'woot' })

  const result = transform('say wat?', '')
  expect(result.code).toBe('say woot?')
})

test('multiple key, value sets', () => {
  const { transform } = plugin({
    wat: 'woot',
    say: 'think',
    'process.env.PORT': '5000',
  })

  const result = transform('say wat, process.env.PORT?', '')
  expect(result.code).toBe('think woot, 5000?')
})

test('regex custom keys', () => {
  const { transform } = plugin({
    '/.a./': 'woot',
  })

  const result = transform('say wat?', '')
  expect(result.code).toBe('woot woot?')
})
