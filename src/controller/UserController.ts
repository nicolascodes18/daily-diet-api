import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { comparePassword } from '../functions/comparePassword'
import { hashPassword } from '../functions/hashPassword'

export async function UserController(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    })

    const { name, email, password } = createUserSchema.parse(request.body)

    const findUser = await knex('users').where({ email }).first()

    if (findUser) {
      return reply
        .status(400)
        .send({ status: 'error', message: 'Email already exists' })
    }

    const hash = await hashPassword(password)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password: hash,
    })

    return reply.status(201).send('User created successfully!')
  })

  app.post('/login', async (request, reply) => {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = loginSchema.parse(request.body)

    const user = await knex('users').where({ email }).first()

    if (!user) {
      return reply
        .status(400)
        .send({ status: 'error', message: 'User email invalid' })
    }

    const encrypted = user.password === undefined ? '' : user.password

    const pass = await comparePassword(password, encrypted)

    if (!pass) {
      return reply
        .status(400)
        .send({ status: 'error', message: 'User password invalid' })
    }

    let sessionId = request.cookies.sessionId

    if (!sessionId && user.id !== undefined) {
      sessionId = randomUUID()
      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
    }

    return reply.status(200).send({ status: 'success', message: 'Logged in' })
  })
}
