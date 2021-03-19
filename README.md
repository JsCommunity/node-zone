# node-zone

[![Package Version](https://badgen.net/npm/v/node-zone)](https://npmjs.org/package/node-zone) [![Build Status](https://travis-ci.org/JsCommunity/node-zone.png?branch=master)](https://travis-ci.org/JsCommunity/node-zone) [![PackagePhobia](https://badgen.net/packagephobia/install/node-zone)](https://packagephobia.now.sh/result?p=node-zone) [![Latest Commit](https://badgen.net/github/last-commit/JsCommunity/node-zone)](https://github.com/JsCommunity/node-zone/commits/master)

> minimal Zone implementation for Node

This implementation is based on the [experimental `async_hooks` API](https://nodejs.org/docs/latest/api/async_hooks.html), but it seems to work fine.

Work with any asynchronous tasks (IO, timers, promises, external modules, …).

> Warning: Don't work correctly with sync/async generator functions.

## What are zones and why use them

Zones are a way to pass contextual data through the call stack without the need to pass them explicitely via arguments.

They are useful in a number of cases, a few example:

- passing a logger
- passing a user record, for instance for checking permissions in an API implementation
- passing a lang or theme preference, in case of a UI

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

## With Bluebird

If you are using Bluebird promises, you need to enable `async_hooks` support:

```js
Bluebird.config({
  asyncHooks: true,
});
```

Source: [Bluebird documentation](http://bluebirdjs.com/docs/api/promise.config.html#async-hooks).

## Contributions

Contributions are _very_ welcomed, either on the documentation or on
the code.

You may:

- report any [issue](https://github.com/JsCommunity/node-zone)
  you've encountered;
- fork and create a pull request.

## License

ISC © [Julien Fontanet](https://github.com/julien-f)
