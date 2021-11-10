const mockPublishedMemo = require('../mocks/publishedMemo')
const mockDraftOfPublished = require('../mocks/draftOfPublished')
jest.mock('../../server/lib/dbDataById', () => {
  return {
    fetchMemoByEndPointAndStatus(memoEndPoint, status) {
      if (status === 'published')
        return new Promise((resolve, reject) => {
          resolve({ status: 200, ...mockPublishedMemo })
        })
      else
        return new Promise((resolve, reject) => {
          resolve({ status: 200, ...mockDraftOfPublished })
        })
    },
    storeNewCourseMemoData: jest.fn(),
    updateMemoByEndPointAndStatus: jest.fn(),
    removeCourseMemoDataById: jest.fn(),
  }
})

jest.mock('../../server/lib/dbSeveralDocument', () => {
  return {
    getCourseSemesterUsedRounds(courseCode, semester) {
      return new Promise((resolve, reject) => {
        resolve({ status: 201 })
      })
    },
    getAllMemosByStatus(courseCode, type) {
      return new Promise((resolve, reject) => {
        resolve({ status: 201 })
      })
    },
  }
})
jest.mock('../../server/configuration', () => {
  return {
    server: {
      api_keys: '1234',
      apiKey: {},
      nodeApi: {},
      db: {},
      logging: {
        log: {
          level: 'debug',
        },
      },
      proxyPrefixPath: {
        uri: 'kurs-pm-data',
      },
      collections: ['dev-tests'],
    },
  }
})

jest.mock('../../server/controllers/storedMemoPdfsCtrl', () => {
  return {
    StoredMemoPdf: { collectionLength: jest.fn() },
  }
})

function buildReq(overrides) {
  const req = { headers: { accept: 'application/json' }, body: {}, params: {}, ...overrides }
  return req
}

function buildRes(overrides = {}) {
  const res = {
    json: jest
      .fn(() => {
        return res
      })
      .mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    type: jest.fn(() => res).mockName('type'),
    send: jest.fn(() => res).mockName('send'),
    render: jest.fn(() => res).mockName('render'),

    ...overrides,
  }
  return res
}

function buildNext(impl) {
  return jest.fn(impl).mockName('next')
}

const reqOverride = {
  params: { memoEndPoint: 'EH272020192-1', anotherMemoEndPoint: 'EH272020192-1' },
}
jest.mock('kth-node-log', () => {
  return {
    init: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  }
})
describe('', () => {
  beforeEach(() => {
    jest.resetModules()
    // process.env = { ...OLD_ENV }
    jest.clearAllMocks()
  })
  test('getPublishedMemoByEndPoint', async done => {
    const { getPublishedMemoByEndPoint } = require('../../server/controllers/memoDataCtrl')
    const req = buildReq(reqOverride)
    const res = buildRes()
    const response = await getPublishedMemoByEndPoint(req, res)
    expect(res.json).toHaveBeenCalledTimes(1)
    done()
  })

  test('postNewVersionOfPublishedMemo', async done => {
    const { postNewVersionOfPublishedMemo } = require('../../server/controllers/memoDataCtrl')
    const req = buildReq(reqOverride)
    const res = buildRes()
    await postNewVersionOfPublishedMemo(req, res)
    expect(res.status).toHaveBeenNthCalledWith(1, 201)
    expect(res.json).toHaveBeenCalledTimes(1)
    done()
  })

  test('getDraftByEndPoint', async done => {
    const { getDraftByEndPoint } = require('../../server/controllers/memoDataCtrl')
    const req = buildReq(reqOverride)
    const res = buildRes()
    await getDraftByEndPoint(req, res)
    // expect(res.status).toHaveBeenNthCalledWith(1, 201)
    expect(res.json).toHaveBeenCalledTimes(1)
    done()
  })

  test('putDraftByEndPoint', async done => {
    const { putDraftByEndPoint } = require('../../server/controllers/memoDataCtrl')
    const req = buildReq({ ...reqOverride, ...{ body: { equipment: 'Laptop' } } })
    const res = buildRes()
    await putDraftByEndPoint(req, res)
    expect(res.status).toHaveBeenNthCalledWith(1, 201)
    expect(res.json).toHaveBeenCalledTimes(1)
    done()
  })

  test('createDraftByMemoEndPoint', async done => {
    const { createDraftByMemoEndPoint } = require('../../server/controllers/memoDataCtrl')
    const req = buildReq({
      ...reqOverride,
    })
    const res = buildRes()
    await createDraftByMemoEndPoint(req, res)
    expect(res.status).toHaveBeenNthCalledWith(1, 201)
    expect(res.json).toHaveBeenCalledTimes(1)
    done()
  })

  test('getAllMemosByCourseCodeAndType', async done => {
    const { getAllMemosByCourseCodeAndType } = require('../../server/controllers/memoDataCtrl')
    const req = buildReq(reqOverride)
    const res = buildRes()
    await getAllMemosByCourseCodeAndType(req, res)
    expect(res.json).toHaveBeenCalledTimes(1)
    done()
  })

  test('getCourseSemesterUsedRounds', async done => {
    const { getCourseSemesterUsedRounds } = require('../../server/controllers/memoDataCtrl')
    const req = buildReq({ courseCode: 'EH2720', semester: '20192' })
    const res = buildRes()
    await getCourseSemesterUsedRounds(req, res)
    expect(res.json).toHaveBeenCalledTimes(1)
    done()
  })
})
