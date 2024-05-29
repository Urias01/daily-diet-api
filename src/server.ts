import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from './env'

const app = fastify()

app.register(cookie)

app.get('/', () => {
  return { hello: 'world' }
})

app.listen({ port: env.PORT, host: '0.0.0.0'}).then(() => {
  console.log(`server listening on ${env.PORT}`)
})