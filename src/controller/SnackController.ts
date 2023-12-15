import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import z from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

const getUserIdSchema = z.object({
  id: z.string().uuid(),
})

export async function SnackController(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies

    const snacks = await knex('snacks')
      .select('*')
      .where({ session_id: sessionId })

    return snacks
  })

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const { id } = getUserIdSchema.parse(request.params)

      const snack = await knex('snacks')
        .select('*')
        .where({ id, session_id: sessionId })
        .first()

      return reply.status(200).send(snack)
    },
  )

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies
      const summary = await knex('snacks')
        .select(
          knex.raw(
            'count(*) filter (where isValidDiet = true) as validDietCount',
          ),
          knex.raw(
            'count(*) filter (where isValidDiet = false) as invalidDietCount',
          ),
          knex.raw('count(*) as totalCount'),
        )
        .where({ session_id: sessionId })

      return summary
    },
  )

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const updateSnackSchema = z.object({
        name: z.string(),
        description: z.string().optional(),
        isValidDiet: z.boolean(),
        createAt: z.string().datetime().optional(),
      })

      const { id } = getUserIdSchema.parse(request.params)

      const { name, description, isValidDiet, createAt } =
        updateSnackSchema.parse(request.body)

      await knex('snacks')
        .update({ name, description, isValidDiet, createAt })
        .where({ id, session_id: sessionId })

      return reply.status(200).send('Snack updated successfully!')
    },
  )

  app.delete('/:id', async (request, reply) => {
    const { sessionId } = request.cookies

    const { id } = getUserIdSchema.parse(request.params)

    await knex('snacks').delete().where({ id, session_id: sessionId })

    return reply.status(200).send('Snack deleted successfully!')
  })

  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const snackValidationSchema = z.object({
        name: z.string(),
        description: z.string(),
        isValidDiet: z.boolean(),
      })

      const { name, description, isValidDiet } = snackValidationSchema.parse(
        request.body,
      )

      await knex('snacks').insert({
        id: randomUUID(),
        session_id: request.cookies.sessionId,
        name,
        description,
        isValidDiet,
      })

      return reply.status(201).send('Snack created successfully!')
    },
  )
}
