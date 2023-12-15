import type { FastifyCookieOptions } from '@fastify/cookie'
import cookie from '@fastify/cookie'
import { app } from './app'
import { SnackController } from './controller/SnackController'
import { UserController } from './controller/UserController'
import { env } from './env'

app.register(cookie, {} as FastifyCookieOptions)

app.register(UserController, { prefix: '/users' })
app.register(SnackController, { prefix: '/snacks' })

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('Server is running at http://localhost:3333')
  })
