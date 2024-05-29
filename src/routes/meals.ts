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

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await knex('users')
        .where({ session_id: sessionId })
        .select()
        .first()

      const meals = await knex('meals').where({ user_id: user.id }).select()

      reply.status(200).send({ meals })
    },
  )

  app.get(
    '/:mealId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const mealsParams = z.object({
        mealId: z.string(),
      })

      const { mealId } = mealsParams.parse(request.params)

      const meal = await knex('meals').where({ id: mealId }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      const { sessionId } = request.cookies

      const user = await knex('users')
        .where({ session_id: sessionId })
        .select()
        .first()

      if (meal.user_id !== user.id) {
        return reply.status(401).send({ error: 'Meal is not the users' })
      }

      reply.status(200).send({ meal })
    },
  )

  app.put(
    '/:mealId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const mealsParams = z.object({
        mealId: z.string(),
      })

      const createMealsSchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { mealId } = mealsParams.parse(request.params)
      const { name, description, isOnDiet, date } = createMealsSchema.parse(
        request.body,
      )

      const meal = await knex('meals').where({ id: mealId }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      const { sessionId } = request.cookies

      const user = await knex('users')
        .where({ session_id: sessionId })
        .select()
        .first()

      if (meal.user_id !== user.id) {
        return reply.status(401).send({ error: 'Meal is not the users' })
      }

      await knex('meals').where({ id: mealId }).update({
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
      })

      reply.status(204).send()
    },
  )

  app.delete(
    '/:mealId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const mealsParams = z.object({
        mealId: z.string(),
      })

      const { mealId } = mealsParams.parse(request.params)

      const meal = await knex('meals').where({ id: mealId }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      const { sessionId } = request.cookies

      const user = await knex('users')
        .where({ session_id: sessionId })
        .select()
        .first()

      if (meal.user_id !== user.id) {
        return reply.status(401).send({ error: 'Meal is not the users' })
      }

      await knex('meals').where({ id: mealId, user_id: user.id }).delete()

      reply.status(204).send()
    },
  )

  app.get(
    '/metrics',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await knex('users')
        .where({ session_id: sessionId })
        .select()
        .first()

      const meals = await knex('meals')
        .where({ user_id: user.id })
        .orderBy('date', 'desc')

      const mealsOnDiet = await knex('meals')
        .where({ user_id: user.id, is_on_diet: 1 })
        .count('id', { as: 'total' })
        .first()

      const mealsOffDiet = await knex('meals')
        .where({ user_id: user.id, is_on_diet: 0 })
        .count('id', { as: 'total' })
        .first()

      // Reduce é um acumulador sobre um array
      const { bestOnDietSequence } = meals.reduce(
        (acc, meal) => {
          // lógica de sequencia de dieta
          if (meal.is_on_diet) {
            acc.currentSequence += 1
          } else {
            acc.currentSequence = 0
          }

          // Lógica da melhor sequencia
          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence
          }

          // Acumulador
          return acc
        },
        // Valor inicial
        { bestOnDietSequence: 0, currentSequence: 0 },
      )

      return reply.status(200).send({
        totalMeals: meals.length,
        totalMealsOnDiet: mealsOnDiet?.total,
        totalMealsOffDiet: mealsOffDiet?.total,
        bestOnDietSequence,
      })
    },
  )
}
