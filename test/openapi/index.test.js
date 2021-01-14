/**
 * @jest-environment node
 */

const axios = require('axios')
const jestOpenAPI = require('jest-openapi')
const openApiFile = require('../../swagger.json')

jestOpenAPI(openApiFile)

describe('_checkAPIkey', () => {
  it('should satisfy OpenAPI spec', async (done) => {
    const res = await axios.get('http://localhost:3001/api/kurs-pm-data/_checkAPIkey', {
      headers: {
        api_key: '1234',
        accept: 'application/json'
      }
    })

    expect(res.status).toEqual(200)
    expect(res).toSatisfyApiSpec()
    done()
  })
})
