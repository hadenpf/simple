import * as express from 'express'
import * as yup from 'yup'
import { IPage, Pages } from '../modules/page'
import { response } from '../utils/response'

export function pageRoutes(): express.Router {
  const pages = express.Router()

  pages
    .route('/')
    .get(async (req, res, next) => {
      try {
        const {
          query: { limit = 20 },
        } = req

        const pages = await Pages.list(+limit)

        res.json(response('success', pages))
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
          .shape<{ [key in keyof IPage]: any }>({
            slug: yup.string().required(),
            owner: yup.string().required(),
            title: yup.string().notRequired(),
          })
          .validate(data)

        const page = await Pages.new(data)

        res.json(response('success', page))
      } catch (err) {
        next(err)
      }
    })

  pages
    .route('/:id')
    .get(async (req, res, next) => {
      try {
        const {
          params: { id: slug },
        } = req

        const page = await Pages.getBySlug(slug)

        res.json(page)
      } catch (err) {
        next(err)
      }
    })
    .delete(async (req, res, next) => {
      try {
        const {
          params: { id: slug },
        } = req

        const page = await Pages.getBySlug(slug)
        const deletion = await page.delete()

        if (deletion)
          return res.json(
            response('success', `Deleted page ${page.slug} successfully`)
          )
        else throw new Error('Page not deleted')
      } catch (err) {
        next(err)
      }
    })

  return pages
}
