import { app } from '..'
import { db } from '../database'
import { GenericRequestError, NotFoundError } from '../utils/error'

export interface IPage {
  owner: string
  title?: string
}

export class Pages {
  public static async list(limit: number, cursor: number = 0): Promise<Page[]> {
    const res = await db.pool.query<IPage>(
      `\
      SELECT (owner, title) FROM pages\
        LIMIT $1`,
      [limit]
    )

    const accounts: Page[] = []

    if (res.rowCount)
      for (const account of res.rows) accounts.push(new Page(account))
    else throw new NotFoundError('No pages to list')

    return accounts
  }

  public static async getByName(username: string): Promise<Page> {
    const res = await db.pool.query<IPage>(
      `\
      SELECT * FROM pages\
        WHERE owner = $1\
        LIMIT 1`,
      [username]
    )

    if (res.rowCount) return new Page(res.rows[0])
    else throw new NotFoundError('No page exists for this account')
  }

  public static async new(data: IPage): Promise<Page> {
    try {
      const res = await db.pool.query<IPage>(
        `\
        INSERT INTO pages (owner, title)\
          VALUES ($1, $2)\
          RETURNING *\
				`,
        [data.owner, data.title]
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

  owner

  async delete(): Promise<this> {
    const res = await db.pool.query<IPage>(
      `\
			DELETE FROM pages\
				WHERE owner = $1\
        RETURNING *\
				`,
      [this.owner]
    )

    if (!!res.rowCount) return this
    else throw new Error('Unknown error deleting page')
  }
}
