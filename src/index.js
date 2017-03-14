const zones = Object.create(null)
let current

process.env.NODE_ASYNC_HOOK_NO_WARNING = '1'
const asyncHook = require('async-hook')
asyncHook.addHooks({
  init (uid) {
    zones[uid] = current
  },

  pre (uid) {
    current = zones[uid]
  },

  post (uid) {
  },

  destroy (uid) {
    delete zones[uid]
  }
})
asyncHook.enable()

class Zone {
  constructor (parent, name) {
    if (parent === null) {
      // root zone
      this._data = Object.create(null)
      this._name = '<root>'
      this._parent = null
    } else {
      this._data = Object.create(parent.data)
      this._name = name != null ? name : `${parent.name} child`
      this._parent = parent
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

  fork (name) {
    return new Zone(this, name)
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
}

current = new Zone(null)

module.exports = {
  get current () {
    return current
  }
}
