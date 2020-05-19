import { User } from '../models/User';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';
import { Role } from '../models/Role';

const findAllUsersQuery = 
`SELECT userid, username, password, firstname, lastname, email, project_0.roles.role, roleid
FROM project_0.users INNER JOIN project_0.roles ON project_0.users.role = roleid`;
const findUserQuery = `${findAllUsersQuery} WHERE userid = $1`;
const findRoleQuery = `SELECT roleId FROM project_0.roles WHERE role = $1`;


export async function getAllUsers(): Promise<User[]> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    result = await client.query(findAllUsersQuery);
    return result.rows.map((user) => {
      return new User(user.id, user.username, user.password, user.firstname, user.lastname, user.email, new Role(result.rows[0].roleid, user.role))
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
    result = await client.query(findUserQuery, [userId]);
    if (result.rows.length === 1) {
      let {id, username, password, firstname, lastname, email, role} = result.rows[0];
      return new User(id, username, password, firstname, lastname, email, new Role(result.rows[0].roleid, role))
    } else {
      throw new Error(`Couldn't find userId: ${userId} in the database.`)
    }
  } catch(e) {
    throw new Error(`Failed to query for user: ${e.message}`);
  } finally {
    client && client.release();
  }
}

export async function patchUser(userId: number, user: User): Promise<User> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    result = await client.query(findUserQuery, [userId]);
    // console.log(result);
    if (result.rows.length === 1) {
      // Confirm that the role we are trying to change to exists
      if (user.role !== undefined) {
        let roleResults = await client.query(findRoleQuery, [user.role.role]);
        if (roleResults.rows[0] === undefined) {
          throw new Error(`Role: "${user.role.role}" - Is not in our database.`);
        }
      }
      // // Change all the fields if they are provided
      // // This is not updating user outside. How to resolve?
      let patchUserQuery = `UPDATE project_0.users SET username = $2, password = $3, firstname = $4, lastname = $5, email = $6, role = $7 WHERE userid = $1`;
      let updateArray : any[] = [];
      // Append our patchUserQuery with all the rows that are passed in
      for (let field in result.rows[0]) {
        if (user[field] !== undefined) {
          updateArray.push(user[field]);
        } else {
          updateArray.push(result.rows[0][field]);
        }
      }
      // Use these when we return our new user
      let roleId = updateArray.pop();
      let roleString = updateArray.pop();
      updateArray.push(roleId);

      let patchedResult : QueryResult;
      patchedResult = await client.query(patchUserQuery, updateArray);
      let [userId, userName, password, firstName, lastName, email] = updateArray;
      // For some reason the spead operator isn't working here so I used destructuring
      console.log(patchedResult);
      return new User(userId, userName, password, firstName, lastName, email, new Role(roleId, roleString));
    } 
    throw new Error(`Couldn't find user.`);
  } catch(e) {
    throw new Error(`Failed to patch user: ${e.message}`)
  } finally {
    client && client.release();
  }
}