import fastify from 'fastify'
import { env } from './config/env'

import { SnackController } from './controller/SnackController'
import { UserController } from './controller/UserController'

const server = fastify()

server.register(UserController, { prefix: '/users' })
server.register(SnackController, { prefix: '/snacks' })

server
  .listen({
    port: env.PORT,
  })
  .then((address) => console.log(`Server is running on ${address}`))
