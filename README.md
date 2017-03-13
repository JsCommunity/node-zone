# node-zone [![Build Status](https://travis-ci.org/JsCommunity/node-zone.png?branch=master)](https://travis-ci.org/JsCommunity/node-zone)

> minimal Zone implementation for Node

This implementation is based on the [experimental AsyncWrap API](https://github.com/nodejs/diagnostics/blob/master/tracing/AsyncWrap/README.md), but it seems to work fine.

Work with any asynchronous tasks (IO, timers, promises, external modules, …).

## Install

Installation of the [npm package](https://npmjs.org/package/node-zone):

```
> npm install --save node-zone
```

## Usage

```js
import { current } from 'node-zone'

// a zone as a name, a parent, and data
console.log(
  current.name,   // root
  current.parent, // null
  current.data    // { __proto__: null }
)

// create a new child zone
//
// data is prototypally inherited from parent zone
const myZone = current.fork('my zone')

// run some code in it
myZone.run(() => {
  console.log(current.name) // my zone

  // zone is preserved in async functions
  process.nextTick(() => {
    console.log(current.name) // my zone
  })
})

console.log(current.name) // root
```

## Development

```
# Install dependencies
> npm install

# Run the tests
> npm test

# Continuously compile
> npm run dev

# Continuously run the tests
> npm run dev-test

# Build for production (automatically called by npm install)
> npm run build
```

## Contributions

Contributions are *very* welcomed, either on the documentation or on
the code.

You may:

- report any [issue](https://github.com/JsCommunity/node-zone)
  you've encountered;
- fork and create a pull request.

## License

ISC © [Julien Fontanet](https://github.com/julien-f)
