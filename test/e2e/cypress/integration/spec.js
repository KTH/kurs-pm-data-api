it('Should be able to check correct api key', () => {
  cy.request({
    url: '_checkAPIkey',
    headers: {
      api_key: '1234',
      accept: 'application/json'
    }
  }).then((res) => {
    expect(res.status).to.eq(200)
  })
})

it('Should fail to check incorrect api key', () => {
  cy.request({
    url: '_checkAPIkey',
    headers: {
      api_key: '5678',
      accept: 'application/json'
    },
    failOnStatusCode: false
  }).then((res) => {
    expect(res.status).to.eq(401)
  })
})
