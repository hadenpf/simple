import { app } from '..'
import { db } from '../database'
import { GenericRequestError, NotFoundError } from '../utils/error'

export interface IPage {
  slug: string
  owner: string
  title?: string
}

export class Pages {
  public static async list(limit: number, cursor: number = 0): Promise<Page[]> {
    const fields = ['owner', 'slug', 'title'] as const

    const res = await db.pool.query<Pick<IPage, typeof fields[number]>>(
      `\
      SELECT ${fields.join(', ')} FROM pages\
        LIMIT $1`,
      [limit]
    )

    const pages: Page[] = []

    if (res.rowCount)
      for (const page of res.rows) pages.push(new Page( page))
    else throw new NotFoundError('No pages to list')

    return pages
  }

  public static async getByUser(username: string): Promise<Page[]> {
    const res = await db.pool.query<IPage>(
      `\
      SELECT * FROM pages\
        WHERE owner = $1`,
      [username]
    )

    const pages: Page[] = []

    if (res.rowCount > 0)
      for (const page of res.rows) pages.push(new Page(page))

    return pages
  }

  public static async getBySlug(slug: string): Promise<Page> {
    const res = await db.pool.query<IPage>(
      `\
      SELECT * FROM pages\
        WHERE slug = $1\
        LIMIT 1`,
      [slug]
    )

    if (res.rowCount > 0) return new Page(res.rows[0])
    else throw new NotFoundError('Page does not exist')
  }

  public static async new(data: IPage): Promise<Page> {
    try {
      const res = await db.pool.query<IPage>(
        `\
        INSERT INTO pages (slug, owner, title)\
          VALUES ($1, $2, $3)\
          RETURNING *`,
        [data.slug, data.owner, data.title]
      )

      return new Page(res.rows[0])
    } catch (err) {
      if (err.code == '23505')
        // pg duplicate key
        err.message = 'User already has a page'

      throw err
    }
  }
}

export class Page implements IPage {
  constructor(data: IPage) {
    Object.assign(this, data)
  }

  slug
  owner
  title

  async delete(): Promise<IPage> {
    const res = await db.pool.query<IPage>(
      `\
			DELETE FROM pages\
				WHERE slug = $1\
        RETURNING *`,
      [this.slug]
    )

    return res.rows[0]
  }
}
