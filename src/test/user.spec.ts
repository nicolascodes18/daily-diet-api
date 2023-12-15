import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import { app } from '../app'

describe('User Router', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('pnpm knex migrate:rollback --all')
    execSync('pnpm knex migrate:latest')
  })

  const userSchemaTest = {
    email: 'johnDoe@test.com.br',
    password: '123456',
  }

  it('should be able to create a user', async () => {
    await request(app.server)
      .post('/users/register')
      .send({
        name: 'John',
        email: 'johndoe@teste.com.br',
        password: '123456',
      })
      .expect(201)
  })
})
