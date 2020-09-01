const hasOwnProperty = require('has-own-prop')
const {isObject, isArray} = require('core-util-is')


const PREFIX_BEFORE = 'before'
const PREFIX_AFTER_PROP = 'after-prop'
const PREFIX_AFTER_COLON = 'after-colon'
const PREFIX_AFTER_VALUE = 'after-value'
const PREFIX_AFTER = 'after'

const PREFIX_BEFORE_ALL = 'before-all'
const PREFIX_AFTER_ALL = 'after-all'

const BRACKET_OPEN = '['
const BRACKET_CLOSE = ']'
const CURLY_BRACKET_OPEN = '{'
const CURLY_BRACKET_CLOSE = '}'
const COMMA = ','
const EMPTY = ''
const MINUS = '-'

const SYMBOL_PREFIXES = [
  PREFIX_BEFORE,
  PREFIX_AFTER_PROP,
  PREFIX_AFTER_COLON,
  PREFIX_AFTER_VALUE,
  PREFIX_AFTER
]

const NON_PROP_SYMBOL_KEYS = [
  PREFIX_BEFORE,
  PREFIX_BEFORE_ALL,
  PREFIX_AFTER_ALL
].map(Symbol.for)

const COLON = ':'
const UNDEFINED = undefined


const symbol = (prefix, key) => Symbol.for(prefix + COLON + key)

const define = (target, key, value) => Object.defineProperty(target, key, {
  value,
  writable: true,
  configurable: true
})

const copy_comments = (
  target, source, target_key, source_key, prefix, remove_source
) => {
  const source_prop = symbol(prefix, source_key)
  if (!hasOwnProperty(source, source_prop)) {
    return
  }

  const target_prop = target_key === source_key
    ? source_prop
    : symbol(prefix, target_key)

  define(target, target_prop, source[source_prop])

  if (remove_source) {
    delete source[source_prop]
  }
}

// Assign keys and comments
const assign = (target, source, keys) => {
  keys.forEach(key => {
    if (!hasOwnProperty(source, key)) {
      return
    }

    target[key] = source[key]
    SYMBOL_PREFIXES.forEach(prefix => {
      copy_comments(target, source, key, key, prefix)
    })
  })

  return target
}


module.exports = {
  SYMBOL_PREFIXES,
  NON_PROP_SYMBOL_KEYS,

  PREFIX_BEFORE,
  PREFIX_AFTER_PROP,
  PREFIX_AFTER_COLON,
  PREFIX_AFTER_VALUE,
  PREFIX_AFTER,

  PREFIX_BEFORE_ALL,
  PREFIX_AFTER_ALL,

  BRACKET_OPEN,
  BRACKET_CLOSE,
  CURLY_BRACKET_OPEN,
  CURLY_BRACKET_CLOSE,

  COLON,
  COMMA,
  MINUS,
  EMPTY,

  UNDEFINED,

  symbol,
  define,
  copy_comments,

  assign (target, source, keys) {
    if (!isObject(target)) {
      throw new TypeError('Cannot convert undefined or null to object')
    }

    if (!isObject(source)) {
      return target
    }

    if (keys === UNDEFINED) {
      keys = Object.keys(source)
    } else if (!isArray(keys)) {
      throw new TypeError('keys must be array or undefined')
    }

    return assign(target, source, keys)
  }
}