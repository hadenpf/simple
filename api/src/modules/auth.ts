import { app } from '..'
import { db } from '../database'
import { GenericRequestError, NotFoundError } from '../utils/error'

export interface ISession {
  user: string
  token: string
}

export class Sessions {
  public static async getByUser(username: string): Promise<Session[]> {
    const res = await db.pool.query<ISession>(
      `\
      SELECT * FROM sessions\
        WHERE user = $1`,
      [username]
    )

    const sessions: Session[] = []

    if (res.rowCount > 0)
      for (const page of res.rows) sessions.push(new Session(page))

    return sessions
  }

  public static async new(data: ISession): Promise<Session> {
    try {
      const res = await db.pool.query<ISession>(
        `\
        INSERT INTO sessions (user, token)\
          VALUES ($1, $2)\
          RETURNING *`,
        [data.user, data.token]
      )

      return new Session(res.rows[0])
    } catch (err) {
      if (err.code == '23505')
        // pg duplicate key
        err.message = 'Duplicate token'

      throw err
    }
  }
}

export class Session implements ISession {
  constructor(data: ISession) {
    Object.assign(this, data)
  }

  user
  token

  async delete(): Promise<ISession> {
    const res = await db.pool.query<ISession>(
      `\
			DELETE FROM sessions\
				WHERE user = $1\
        RETURNING *`,
      [this.user]
    )

    return res.rows[0]
  }
}
