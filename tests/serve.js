const cheerio = require('cheerio')
const got = require('got')
const exec = require('../lib/exec')

async function get (route) {
  const { body } = await got(`http://localhost:4000${route}`)
  const $ = cheerio.load(body, { xmlMode: true })
  // $.res = Object.assign({}, res)
  return $
}

describe('basic example', () => {
  let server
  beforeAll(async (done) => {
    server = exec('node cli.js serve examples/basic', done)
  })

  afterAll(async (done) => {
    await server.kill()
    done()
  })

  test('data references', async () => {
    const $ = await get('/hello')
    expect($.text().includes('The meaning of life is 42')).toBe(true)
  })

  test('default layout', async () => {
    const $ = await get('/hello')
    expect($('body#default-layout').length).toBe(1)
  })
})

describe('custom example', () => {
  let server
  beforeAll(async (done) => {
    server = exec('node cli.js serve examples/custom', done)
  })

  afterAll(async (done) => {
    await server.kill()
    done()
  })

  describe('data', () => {
    test('.json files', async () => {
      const $ = await get('/')
      expect($.text().includes('Here comes some data: wonka')).toBe(true)
    })
  })

  test('custom default layout', async () => {
    const $ = await get('/')
    expect($.text().includes('I am a new default.')).toBe(true)
  })

  test('custom layout', async () => {
    const $ = await get('/fancy')
    expect($('body#another-layout').length).toBe(1)
  })

  // 404
  // custom 404
  // .yml data files
  // .yaml data files
  // .json data files
  // layouts have access to context
})
