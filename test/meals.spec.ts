import { execSync } from 'node:child_process'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'

describe('Meals Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to register a new meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Test',
      email: 'test@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies || [])
      .send({
        name: 'Test',
        description: 'Test',
        isOnDiet: true,
        date: '2024-05-15',
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Test',
      email: 'test@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies || [])
      .send({
        name: 'Test',
        description: 'Test',
        isOnDiet: true,
        date: '2024-05-15',
      })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies || [])
      .expect(200)

    expect(listMealsResponse.body.meals[0].name).toBe('Test')
  })

  it('should be able to get a meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Test',
      email: 'test@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies || [])
      .send({
        name: 'Test',
        description: 'Test',
        isOnDiet: true,
        date: '2024-05-15',
      })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies || [])
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const mealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies || [])
      .expect(200)

    expect(mealResponse.body.meal.id).toEqual(mealId)
  })

  it('should be able to update a meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Test',
      email: 'test@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies || [])
      .send({
        name: 'Test',
        description: 'Test',
        isOnDiet: true,
        date: '2024-05-15',
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies || [])
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies || [])
      .send({
        name: 'Test 2',
        description: 'Test 2',
        isOnDiet: false,
        date: '2024-05-16',
      })
      .expect(204)

    const mealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies || [])
      .expect(200)

    expect(mealResponse.body.meal.name).toEqual('Test 2')
  })

  it('should be able to delete a meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Test',
      email: 'test@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies || [])
      .send({
        name: 'Test',
        description: 'Test',
        isOnDiet: true,
        date: '2024-05-15',
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies || [])
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies || [])
      .expect(204)

    await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies || [])
      .expect(404)
  })

  it('should be able to get meal metrics', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Test',
      email: 'test@test.com',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies || [])
      .send({
        name: 'Test',
        description: 'Test',
        isOnDiet: true,
        date: '2024-05-15',
      })

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies || [])
      .send({
        name: 'Test 2',
        description: 'Test 2',
        isOnDiet: false,
        date: '2024-05-16',
      })

    const metricsMealsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies || [])
      .expect(200)

    expect(metricsMealsResponse.body).toEqual({
      totalMeals: 2,
      totalMealsOnDiet: 1,
      totalMealsOffDiet: 1,
      bestOnDietSequence: 1,
    })
  })
})
