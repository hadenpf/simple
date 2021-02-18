import * as dotenv from 'dotenv'
import * as path from 'path'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { Database, db } from './database'
import { Accounts } from './modules/account'
import { accountRoutes } from './routes/accounts'
import { response } from './utils/response'
import { NotFoundError } from './utils/error'

// load env vars from file
dotenv.config({
  path: path.join(__dirname, '../.env.local'),
})

class APIApplication {
  server = express()
  port = process.env.PORT ?? 4000

  async init() {
    await db.connect()

    this.server.use(bodyParser.json())
    this.server.use('/accounts', accountRoutes())
    // 404 handler
    this.server.use(async (req, res, next) => {
      next(new NotFoundError('Route does not exist'))
    })
    // error handler
    this.server.use(
      async (
        err: Error,
        req,
        res: express.Response,
        next: express.NextFunction
      ) => {
        if (res.headersSent) return next(err)

        const status: number = err['code'] > 500 ? 500 : err['code'] ?? 500,
          msg: string = err.message ?? err.name ?? err.toString()

        res.status(status).json(response('error', msg, err['code']))
      }
    )

    this.server.listen(this.port)
    console.log(`Listening on :${this.port}`)
  }
}

export const app = new APIApplication()

app.init()
