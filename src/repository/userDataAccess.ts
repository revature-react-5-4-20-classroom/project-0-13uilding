import { User } from '../models/User';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';

const findAllUsersQuery = 
`SELECT userid, username, password, firstname, lastname, email, project_0.roles.role, roleid
FROM project_0.users INNER JOIN project_0.roles ON project_0.users.role = roleid`;
const findUserQuery = `${findAllUsersQuery} WHERE userid = $1`;

const patchUserQuery = 
`UPDATE project_0.users 
SET userid = $1, username = $2, password = $3, firstname = $4, lastname = $5, email = $6, role = $7
WHERE userid = $1`;
const findRoleQuery = `SELECT roleId FROM project_0.roles WHERE role = $1`;


export async function getAllUsers(): Promise<User[]> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    result = await client.query(findAllUsersQuery);
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
    result = await client.query(findUserQuery, [userId]);
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

export async function patchUser(userId: number, user: User): Promise<User> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    result = await client.query(findUserQuery, [userId]);
    // console.log(result);
    if (result.rows.length === 1) {
      // Confirm that the role we are trying to change to exists
      if (user.role === undefined) {
        var roleid: number = result.rows[0].roleid;
      } else {
        let roleResults = await client.query(findRoleQuery, [user.role]);
        if (roleResults.rows[0] === undefined) {
          throw new Error(`Role: "${user.role}" - Is not in our database.`);
        }
        roleid = roleResults.rows[0].roleid;
      }
      // // Change all the fields if they are provided
      // // This is not updating user outside. How to resolve?
      for (let field in result.rows[0]) {
        user[field] = user[field] || result.rows[0][field.toLowerCase()];
        console.log(field);
        console.log(user[field]);
      }
      let {userId, username, password, firstName, lastName, email} = user;
      // console.log(firstName);
      // userId = user.userId || result.rows[0].userId;
      // username = user.username || result.rows[0].username;
      // password = user.password || result.rows[0].password;
      // firstName = user.firstName || result.rows[0].firstname;
      // console.log(firstName);
      // console.log(result.rows[0].firstName);
      // console.log(result.rows[0].firstname);
      // lastName = user.lastName || result.rows[0].lastname;
      // email = user.email || result.rows[0].email;

      let patchedResult : QueryResult;
      patchedResult = await client.query(patchUserQuery, [userId, username, password, firstName, lastName, email, roleid]);
      return user;
    } 
    throw new Error(`Couldn't find user.`);
  } catch(e) {
    throw new Error(`Failed to patch user: ${e.message}`)
  } finally {
    client && client.release();
  }
}