import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createMealsSchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, isOnDiet, date } = createMealsSchema.parse(
        request.body,
      )

      const sessionId = request.cookies.sessionId

      const user = await knex('users')
        .where({ session_id: sessionId })
        .select()
        .first()

      await knex('meals').insert({
        id: randomUUID(),
        user_id: user.id,
        name,
        description,
        is_on_diet: isOnDiet,
        date,
      })

      reply.status(201).send()
    },
  )
}
