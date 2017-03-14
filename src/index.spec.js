/* eslint-env jest */

import { current } from './'

const root = current

describe('Zone', () => {
  describe('root zone', () => {
    it('has “<root>” name', () => {
      expect(root.name).toBe('<root>')
    })

    it('has no parent', () => {
      expect(root.parent).toBe(null)
    })

    it('has an object without prototype data', () => {
      expect(root.data).toEqual({})
      expect(Object.getPrototypeOf(root.data)).toBe(null)
    })
  })

  describe('#fork()', () => {
    it('creates a new child zone', () => {
      const child = root.fork()
      expect(child.name).toBe('<root> child')
      expect(child.parent).toBe(root)
      expect(child.data).toEqual({})
      expect(Object.getPrototypeOf(child.data)).toBe(root.data)
    })

    it('accepts a name param', () => {
      expect(root.fork('child').name).toBe('child')
    })

    it('accepts a ZoneSpec param', () => {
      const child = root.fork({
        name: 'child',
        properties: {
          foo: 'bar'
        }
      })
      expect(child.name).toBe('child')
      expect(child.data).toEqual({ foo: 'bar' })
    })
  })

  describe('#run()', () => {
    it('runs a callback in the zone', done => {
      const child = root.fork()

      child.run(() => {
        expect(current).toBe(child)

        process.nextTick(() => {
          expect(current).toBe(child)
          done()
        })
      })
    })
  })

  describe('#wrap()', () => {
    it('creates a callback which runs in the zone', done => {
      const child = root.fork()

      child.wrap(() => {
        expect(current).toBe(child)

        process.nextTick(() => {
          expect(current).toBe(child)
          done()
        })
      })()
    })
  })

  describe('#get()', () => {
    it('returns a value associated with a key', () => {
      root.data.root = 'foo'
      const child = root.fork()
      child.data.child = 'bar'

      expect(child.get('root')).toBe('foo')
      expect(child.get('child')).toBe('bar')
    })
  })

  describe('#getZoneWith()', () => {
    it('returns the zone which defines a key', () => {
      root.data.root = 'foo'
      const child = root.fork()
      child.data.child = 'bar'

      expect(child.getZoneWith('root')).toBe(root)
      expect(child.getZoneWith('child')).toBe(child)
      expect(child.getZoneWith('foo')).toBe(null)
    })
  })
})
