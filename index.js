const zones = Object.create(null)
let current

// eslint-disable-next-line node/no-missing-require
const asyncHooks = require('async_hooks')
const asyncHook = asyncHooks.createHook({
  init (uid) {
    zones[uid] = current
  },

  before (uid) {
    current = zones[uid]
  },

  after (uid) {
  },

  destroy (uid) {
    delete zones[uid]
  },
})
asyncHook.enable()

class Zone {
  constructor (parent, spec) {
    if (parent === null) {
      // root zone
      this._data = Object.create(null)
      this._name = '<root>'
      this._parent = null
    } else {
      const data = this._data = Object.create(parent.data)
      this._parent = parent

      let name
      if (typeof spec === 'string') {
        name = spec
      } else if (spec != null) {
        name = spec.name

        const { properties } = spec
        if (properties) {
          for (const key in properties) {
            data[key] = properties[key]
          }
        }
      }

      this._name = name || `${parent.name} child`
    }
  }

  get data () {
    return this._data
  }

  get name () {
    return this._name
  }

  get parent () {
    return this._parent
  }

  fork (spec) {
    return new Zone(this, spec)
  }

  run (callback, thisArg, args) {
    const previous = current
    try {
      current = this
      return callback.apply(thisArg, args)
    } finally {
      current = previous
    }
  }

  wrap (callback) {
    const zone = this
    return function (...args) {
      return zone.run(callback, this, args)
    }
  }

  // minimal zone.js compatibility

  get (key) {
    return this._data[key]
  }

  getZoneWith (key) {
    if (Object.prototype.hasOwnProperty.call(this._data, key)) {
      return this
    }

    const parent = this._parent
    return parent && parent.getZoneWith(key)
  }
}

current = new Zone(null)

module.exports = {
  get current () {
    return current
  },
}
