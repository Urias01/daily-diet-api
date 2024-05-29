import { execSync } from 'node:child_process'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to register a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Test',
        email: 'test@test.com',
      })
      .expect(201)
  })
})
