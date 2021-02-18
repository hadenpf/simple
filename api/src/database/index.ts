import { Pool } from 'pg'

export class Database {
  public pool = new Pool({})

  // hoisted methods

  public async connect() {
    if (this.pool.totalCount <= 0) {
      await this.pool.connect()
      console.log('Database connected')
    }
  }
}

export const db = new Database()
