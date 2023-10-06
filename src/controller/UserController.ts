import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'

export async function UserController(app: FastifyInstance) {
  // app.get('/user/:id', async (_, res) => {})

  app.post('/user', async (req, res) => {
    const userValidationSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
    })

    const { name, email, password } = userValidationSchema.parse(req.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password,
    })

    res.status(201).send()
  })
}
