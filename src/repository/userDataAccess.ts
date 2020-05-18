import { User } from '../models/User';
import { PoolClient, QueryResult, Query } from 'pg';
import { connectionPool } from '.';

export async function getAllUsers(): Promise<User[]> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    result = await client.query(
`SELECT userid, username, password, firstname, lastname, email, project_0.roles.role
FROM project_0.users INNER JOIN project_0.roles ON project_0.users.role = roleid`);
    return result.rows.map((user) => {
      return new User(user.id, user.username, user.password, user.firstname, user.lastname, user.email, user.role)
    })
  } catch(e) {
    throw new Error(`Failed to query for all users: ${e.message}`);
  } finally {
    client && client.release();
  }
}

export async function getUser(userId: number): Promise<User> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    result = await client.query(
`SELECT userid, username, password, firstname, lastname, email, project_0.roles.role
FROM project_0.users INNER JOIN project_0.roles ON project_0.users.role = roleid
WHERE userid = $1`, [userId]);
    if (result.rows.length === 1) {
      let {id, username, password, firstname, lastname, email, role} = result.rows[0];
      return new User(id, username, password, firstname, lastname, email, role)
    } else {
      throw new Error(`Couldn't find userId: ${userId} in the database.`)
    }
  } catch(e) {
    throw new Error(`Failed to query for user: ${e.message}`);
  } finally {
    client && client.release();
  }

}


