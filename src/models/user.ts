import { configDotenv } from 'dotenv';
import Client from '../database';
import bcrypt from 'bcrypt';

export type User = {
  id?: number;
  firstName?: string;
  lastName?: string;
  username: string;
  password?: string;
};

export type AuthUser = {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
}

configDotenv();
const { BRYPT_PASSWORD, SALT_ROUND } = process.env;
const pepper = BRYPT_PASSWORD ? BRYPT_PASSWORD : '';
const saltRound = SALT_ROUND ? SALT_ROUND : '';
export class UserStore {
  index = async (): Promise<User[]> => {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT id, username, first_name, last_name FROM users';

      const result = await conn.query(sql);
      conn.release();

      return result.rows.map((r:any): User => ({
        id: r.id,
        username: r.username,
        firstName: r.first_name || undefined,
        lastName: r.last_name || undefined,
      }));
    } catch (error) {
      throw new Error(`Could not get users. Error: ${error}`);
    }
  };

  show = async (id: string): Promise<User> => {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows.map((r:any): User => ({
        id: r.id,
        username: r.username,
        firstName: r.first_name || undefined,
        lastName: r.last_name || undefined,
      }))[0];
    } catch (error) {
      throw new Error(`Could not find user ${id}. Error: ${error}`);
    }
  };

  create = async (u: User): Promise<User> => {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users (first_name, last_name, username, password_digest) VALUES ($1, $2, $3, $4) RETURNING *';

      const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRound));

      const result = await conn.query(sql, [
        u.firstName,
        u.lastName,
        u.username,
        hash,
      ]);
      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not add user ${u.username}. Error: ${error}`);
    }
  };

  authenticate = async (
    username: string,
    password: string,
  ): Promise<AuthUser | null> => {
    const conn = await Client.connect();
    const sql = 'SELECT id, username, password_digest FROM users where username = ($1)';

    const result = await conn.query(sql, [username]);
    if (result.rows.length) {
      const {id, username, password_digest} = result.rows[0];
      if (bcrypt.compareSync(password + pepper, password_digest)) {
        const authUser = {
          id,
          username
        };
        return authUser;
      }
    }
    console.log(`Can't find user`);
    return null;
  };
}
