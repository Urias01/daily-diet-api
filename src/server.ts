import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from './env'
import { usersRoutes } from './routes/user'

const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: '/users',
})

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`server listening on ${env.PORT}`)
})
