'use strict'

/**
 * Sample API controller. Can safely be removed.
 */
const { Sample } = require('../models').sample

async function getData(req, res, next) {
  try {
    let doc = {}
    if (process.env.NODE_MOCK) {
      doc = await { _id: 0, name: 'mockdata' }
    } else {
      doc = await Sample.findById(req.params.id)
    }

    if (!doc) {
      return next()
    }

    res.json({ id: doc._id, name: doc.name })
  } catch (err) {
    next(err)
  }
}

async function postData(req, res, next) {
  try {
    let doc = await Sample.findById(req.params.id)

    if (!doc) {
      doc = new Sample({
        _id: req.params.id,
        name: req.body.name,
      })
    } else {
      doc.name = req.body.name
    }

    await doc.save()
    res.json({ id: doc._id, name: doc.name })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getData,
  postData,
}
