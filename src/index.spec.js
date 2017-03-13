/* eslint-env jest */

import { current } from './'

const root = current

describe('Zone', () => {
  describe('root zone', () => {
    it('has “root” name', () => {
      expect(root.name).toBe('root')
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
      const child = root.fork('child zone')
      expect(child.name).toBe('child zone')
      expect(child.parent).toBe(root)
      expect(child.data).toEqual({})
      expect(Object.getPrototypeOf(child.data)).toBe(root.data)
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
})
