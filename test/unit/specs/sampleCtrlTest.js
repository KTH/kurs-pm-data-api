/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

'use strict'

const proxyquire = require('proxyquire')
const { expect } = require('chai')

function MockSample(doc) {
  this._id = doc._id
  this.name = doc.name
}

MockSample.findById = function(id) {
  let doc

  if (id === '123') {
    doc = new MockSample({ _id: id, name: 'foo' })
  }

  if (id === 'fail') {
    return Promise.reject(new Error('error'))
  }

  return Promise.resolve(doc)
}

MockSample.prototype.save = function save() {
  if (this._id === '123' || this._id === 'abc') {
    return Promise.resolve()
  }

  return Promise.reject(new Error('error'))
}

const sample = proxyquire('../../../server/controllers/sampleCtrl', {
  '../models': {
    sample: {
      Sample: MockSample,
    },
  },
})

describe('Tests', function test() {
  it('should getData ok', () => {
    const req = {
      params: {
        id: '123',
      },
    }

    const res = {
      json: obj => {
        expect(obj.id).to.equal('123')
      },
    }

    const next = err => {
      expect(err).to.be.undefined
    }

    sample.getData(req, res, next)
  })

  it('should handle getData not found', () => {
    const req = {
      params: {
        id: 'abc',
      },
    }

    const res = {
      json: data => {
        expect(data).to.be.undefined
      },
    }

    const next = err => {
      expect(err).to.be.undefined
    }

    sample.getData(req, res, next)
  })

  it('should handle getData fail', () => {
    const req = {
      params: {
        id: 'fail',
      },
    }

    const res = {
      json: data => {
        expect(data).to.be.undefined
      },
    }

    const next = err => {
      expect(err).to.be.not.undefined
    }

    sample.getData(req, res, next)
  })

  it('should postData update ok', () => {
    const req = {
      params: {
        id: '123',
      },
      body: {
        name: 'foo',
      },
    }

    const res = {
      json: obj => {
        expect(obj.id).to.equal('123')
      },
    }

    const next = err => {
      expect(err).to.be.undefined
    }

    sample.postData(req, res, next)
  })

  it('should postData create ok', () => {
    const req = {
      params: {
        id: 'abc',
      },
      body: {
        name: 'foo',
      },
    }

    const res = {
      json: obj => {
        expect(obj.id).to.equal('abc')
      },
    }

    const next = err => {
      expect(err).to.be.undefined
    }

    sample.postData(req, res, next)
  })

  it('should handle postData fail', () => {
    const req = {
      params: {
        id: 'fail',
      },
      body: {
        name: 'foo',
      },
    }

    const res = {
      json: data => {
        expect(data).to.be.undefined
      },
    }

    const next = err => {
      expect(err).to.be.not.undefined
    }

    sample.postData(req, res, next)
  })
})
