const mockPublishedMemo = require('../mocks/publishedMemo')
const mockDraftOfPublished = require('../mocks/draftOfPublished')
jest.mock('../../server/lib/dbDataById', () => {
  return {
    fetchMemoByEndPointAndStatus(memoEndPoint, status) {
      if (memoEndPoint === 'NonExistentMemo') {
        return new Promise((resolve, reject) => {
          resolve(null)
        })
      }
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
    updateMemoByEndPointAndStatus: jest.fn((memoEndPoint, status) => {
      if (memoEndPoint === 'EndpointToTriggerInvalidData') {
        const { InvalidDataError } = require('../../server/utils/errorUtils')
        return new Promise((resolve, reject) => {
          reject(new InvalidDataError('Some error message from mock'))
        })
      }
      if (status === 'published')
        return new Promise((resolve, reject) => {
          resolve({ status: 200, ...mockPublishedMemo })
        })
      else
        return new Promise((resolve, reject) => {
          resolve({ status: 200, ...mockDraftOfPublished })
        })
    }),
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

const memoEndPoint = 'EH272020192-1'
const reqOverride = {
  params: { memoEndPoint: memoEndPoint, anotherMemoEndPoint: memoEndPoint },
}
jest.mock('@kth/log', () => {
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
  test('getPublishedMemoByEndPoint', async () => {
    const { getPublishedMemoByEndPoint } = require('../../server/controllers/memoDataCtrl')
    const req = buildReq(reqOverride)
    const res = buildRes()
    const response = await getPublishedMemoByEndPoint(req, res)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('postNewVersionOfPublishedMemo', async () => {
    const { postNewVersionOfPublishedMemo } = require('../../server/controllers/memoDataCtrl')
    const { updateMemoByEndPointAndStatus } = require('../../server/lib/dbDataById')

    const req = buildReq(reqOverride)
    const res = buildRes()
    await postNewVersionOfPublishedMemo(req, res)
    expect(res.status).toHaveBeenNthCalledWith(1, 201)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(updateMemoByEndPointAndStatus).toHaveBeenNthCalledWith(
      1,
      memoEndPoint,
      { ...mockPublishedMemo, status: 'old' },
      'published'
    )
    expect(updateMemoByEndPointAndStatus).toHaveBeenNthCalledWith(2, memoEndPoint, expect.any(Object), 'draft')
  })

  test('postNewVersionOfPublishedMemo passes on InvalidDataError as 400', async () => {
    const { postNewVersionOfPublishedMemo } = require('../../server/controllers/memoDataCtrl')

    const override = { params: { memoEndPoint: 'EndpointToTriggerInvalidData' }, body: {} }
    const req = buildReq(override)
    const res = buildRes()
    await postNewVersionOfPublishedMemo(req, res)
    expect(res.status).toHaveBeenNthCalledWith(1, 400)
    expect(res.json).toHaveBeenNthCalledWith(1, 'Some error message from mock')
  })

  test('getDraftByEndPoint', async () => {
    const { getDraftByEndPoint } = require('../../server/controllers/memoDataCtrl')
    const req = buildReq(reqOverride)
    const res = buildRes()
    await getDraftByEndPoint(req, res)
    // expect(res.status).toHaveBeenNthCalledWith(1, 201)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('putDraftByEndPoint', async () => {
    const { putDraftByEndPoint } = require('../../server/controllers/memoDataCtrl')
    const { updateMemoByEndPointAndStatus } = require('../../server/lib/dbDataById')

    const req = buildReq({ ...reqOverride, ...{ body: { equipment: 'Laptop' } } })
    const res = buildRes()

    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'))

    await putDraftByEndPoint(req, res)

    const lastChangeDate = new Date()

    const expectedMemo = { equipment: 'Laptop', lastChangeDate }

    expect(updateMemoByEndPointAndStatus).toHaveBeenNthCalledWith(1, memoEndPoint, expectedMemo, 'draft')

    expect(res.status).toHaveBeenNthCalledWith(1, 201)
    expect(res.json).toHaveBeenCalledTimes(1)

    jest.useRealTimers()
  })

  test('putDraftByEndpoint passes on InvalidDataError as 400', async () => {
    const { putDraftByEndPoint } = require('../../server/controllers/memoDataCtrl')

    const override = { params: { memoEndPoint: 'EndpointToTriggerInvalidData' }, body: {} }
    const req = buildReq(override)
    const res = buildRes()

    await putDraftByEndPoint(req, res)
    expect(res.status).toHaveBeenNthCalledWith(1, 400)
    expect(res.json).toHaveBeenNthCalledWith(1, 'Some error message from mock')
  })

  test('createDraftByMemoEndPoint', async () => {
    const { createDraftByMemoEndPoint } = require('../../server/controllers/memoDataCtrl')
    const req = buildReq({
      ...reqOverride,
    })
    const res = buildRes()
    await createDraftByMemoEndPoint(req, res)
    expect(res.status).toHaveBeenNthCalledWith(1, 201)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('getAllMemosByCourseCodeAndType', async () => {
    const { getAllMemosByCourseCodeAndType } = require('../../server/controllers/memoDataCtrl')
    const req = buildReq(reqOverride)
    const res = buildRes()
    await getAllMemosByCourseCodeAndType(req, res)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('getCourseSemesterUsedRounds', async () => {
    const { getCourseSemesterUsedRounds } = require('../../server/controllers/memoDataCtrl')
    const req = buildReq({ courseCode: 'EH2720', semester: '20192' })
    const res = buildRes()
    await getCourseSemesterUsedRounds(req, res)
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
