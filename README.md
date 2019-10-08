# node-zone

[![Package Version](https://badgen.net/npm/v/node-zone)](https://npmjs.org/package/node-zone) [![Build Status](https://travis-ci.org/JsCommunity/node-zone.png?branch=master)](https://travis-ci.org/JsCommunity/node-zone) [![PackagePhobia](https://badgen.net/packagephobia/install/node-zone)](https://packagephobia.now.sh/result?p=node-zone) [![Latest Commit](https://badgen.net/github/last-commit/JsCommunity/node-zone)](https://github.com/JsCommunity/node-zone/commits/master)

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
import { current } from "node-zone";

// a zone has a name, a parent, and data
console.log(
  current.name, // "<root>"
  current.parent, // null
  current.data // { __proto__: null }
);

// create a new child zone
const myZone = current.fork("my zone");

console.log(
  myZone.name, // "my zone"
  myZone.parent, // current
  myZone.data // { __proto__: current.data }
);

// run some code in it
myZone.run(() => {
  console.log(current.name); // "my zone"

  // zone is preserved in async functions
  process.nextTick(() => {
    console.log(current.name); // "my zone"
  });
});

console.log(current.name); // "<root>"
```

> Note: There [is an issue](https://github.com/JsCommunity/node-zone/issues/3)
> with Node cluster module, which prevents handlers created in workers to
> properly access the current zone, `Zone.current` will be the root zone
> instead.

## Development

```
# Install dependencies
> yarn

# Run the tests
> yarn test

# Continuously compile
> yarn dev

# Continuously run the tests
> yarn dev-test

# Build for production (automatically called by npm install)
> yarn build
```

## Contributions

Contributions are _very_ welcomed, either on the documentation or on
the code.

You may:

- report any [issue](https://github.com/JsCommunity/node-zone)
  you've encountered;
- fork and create a pull request.

## License

ISC © [Julien Fontanet](https://github.com/julien-f)
