import * as express from 'express'
import * as yup from 'yup'
import { Accounts, IAccount } from '../modules/account'
import { Pages } from '../modules/page'
import { GenericRequestError, NotFoundError } from '../utils/error'
import { response } from '../utils/response'

export function accountRoutes(): express.Router {
  const accounts = express.Router()

  accounts
    .route('/')
    .get(async (req, res, next) => {
      try {
        const {
          query: { limit = 20 },
        } = req

        const accounts = await Accounts.list(+limit)

        res.json(response('success', accounts))
      } catch (err) {
        next(err)
      }
    })
    .post(async (req, res, next) => {
      try {
        const { body: data } = req

        await yup
          .object()
          .defined()
          .shape<{ [key in keyof IAccount]: any }>({
            username: yup.string().required(),
            display_name: yup.string().notRequired(),
          })
          .validate(data)

        const account = await Accounts.new(data)

        res.json(response('success', { account }))
      } catch (err) {
        next(err)
      }
    })

  accounts
    .route('/:id')
    .get(async (req, res, next) => {
      try {
        const {
          params: { id },
        } = req

        const account = await Accounts.getByName(id)

        res.json(account)
      } catch (err) {
        next(err)
      }
    })
    .delete(async (req, res, next) => {
      try {
        const {
          params: { id },
        } = req

        const account = await Accounts.getByName(id)
        const deletion = await account.delete()

        if (deletion)
          return res.json(
            response('success', `Deleted ${account.username} successfully`)
          )
        else throw new Error('Account not deleted')
      } catch (err) {
        next(err)
      }
    })

  accounts.route('/:id/pages').get(async (req, res, next) => {
    try {
      const {
        params: { id },
      } = req

      const account = await Accounts.getByName(id)
      const pages = await Pages.getByUser(account.username)

      if (pages.length > 0) return res.json(response('success', pages))
      else throw new NotFoundError('No pages exist for this user')
    } catch (err) {
      next(err)
    }
  })

  return accounts
}
