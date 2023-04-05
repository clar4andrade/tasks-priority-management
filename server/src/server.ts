import './util/module-alias'
import { Server } from '@overnightjs/core'
import { Application } from 'express'
import * as http from 'http'
import cors from 'cors'
import express from 'express'
import UserController from './controllers/user'
import TasksController from './controllers/tasks'
import * as database from '@src/database'
import expressPino from 'express-pino-logger'
import logger from '@src/logger'
import { UserMongoDBRepository } from './repositories/userMongoDBRepository'
import { TasksMongoDBRepository } from './repositories/tasksMongoDBRepository'

export class SetupServer extends Server {
  private server?: http.Server

  constructor(private port = 4000) {
    super()
  }

  public async init(): Promise<void> {
    this.expressSetup()
    this.controllersSetup()
    await this.databaseSetup()
  }

  private expressSetup(): void {
    this.app.use(express.json())
    this.app.use(expressPino({logger}))
    this.app.use(
      cors({
        origin: 'http://localhost:3000',
      })
    )
  }

  private async databaseSetup(): Promise<void> {
    await database.connect()
  }
  
  private controllersSetup(): void {
    const usersController = new UserController(new UserMongoDBRepository())
    const tasksController = new TasksController(new TasksMongoDBRepository())

    this.addControllers([usersController, tasksController])
  }

  public getApp(): Application {
    return this.app
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      logger.info('Server Listening on port', this.port)
    })
  }
}
