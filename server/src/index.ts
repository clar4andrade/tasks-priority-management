import { SetupServer } from './server'
import logger from '@src/logger'

;(async (): Promise<void> => {
  try {
    const server = new SetupServer(4000)
    await server.init()
    server.start()
  } catch (error) {
    logger.error(`App exited with error: ${error}`)
  }
})()