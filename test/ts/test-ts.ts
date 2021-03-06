import {
  parse,
  stringify,
  tokenize,

  CommentArray,
  assign
} from '../..'

const assert = (test: boolean, message: string): void => {
  if (!test) {
    throw new Error(message)
  }
}

assert(parse('{"a":1}').a === 1, 'basic parse')

const str = `{
  // This is a comment
  "foo": "bar"
}`
const parsed = parse(str)

const obj = assign({
  bar: 'baz'
}, parsed)

assert(stringify(obj, null, 2) === `{
  "bar": "baz",
  // This is a comment
  "foo": "bar"
}`, 'assign')

assert(Array.isArray(tokenize(str)), 'tokenize')
