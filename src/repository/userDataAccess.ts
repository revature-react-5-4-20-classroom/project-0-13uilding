import { User } from '../models/User';
import { PoolClient, QueryResult } from 'pg';
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
