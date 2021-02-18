import { app } from '..'
import { db } from '../database'
import { GenericRequestError, NotFoundError } from '../utils/error'

export interface IAccount {
  username: string
  display_name?: string
}

export class Accounts {
  public static async list(
    limit: number,
    cursor: number = 0
  ): Promise<Account[]> {
    const res = await db.pool.query(
      `\
			SELECT * FROM accounts\
				LIMIT $1
			`,
      [limit]
    )

    const accounts: Account[] = []

    if (res.rowCount)
      for (const account of res.rows) accounts.push(new Account(account))
    else throw new NotFoundError('No accounts to list')

    return accounts
  }

  public static async getByName(username: string): Promise<Account> {
    const res = await db.pool.query(
      `\
			SELECT * FROM accounts\
				WHERE username = $1\
				LIMIT 1`,
      [username]
    )

    if (res.rowCount) return new Account(res.rows[0])
    else throw new NotFoundError('Account not found')
  }

  public static async new(data: IAccount): Promise<Account> {
    try {
      const res = await db.pool.query(
        `\
				INSERT INTO accounts (username, display_name)\
				VALUES ($1, $2)\
				RETURNING *\
				`,
        [data.username, data.display_name]
      )

      return new Account(res.rows[0])
    } catch (err) {
      if (err.code == '23505')
        // pg duplicate key
        err.message = 'Username is taken'

      throw err
    }
  }
}

export class Account implements IAccount {
  constructor(data: IAccount) {
    Object.assign(this, data)
  }

  username
  display_name

  async delete(): Promise<boolean> {
    const res = await db.pool.query(
      `\
			DELETE FROM accounts\
				WHERE username = $1\
				`,
      [this.username]
    )

    return !!res.rowCount
  }
}
