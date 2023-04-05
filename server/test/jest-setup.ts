import { SetupServer } from '../src/server'
import supertest from 'supertest'
import mongoose from 'mongoose'

jest.setTimeout(20000)

beforeAll(() => {
  const server = new SetupServer()
  server.init()
  global.testRequest = supertest(server.getApp())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoose.connection.close()
})