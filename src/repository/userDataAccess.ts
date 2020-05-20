import { User } from '../models/User';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';
import { Role } from '../models/Role';

const findAllUsersQuery = 
`SELECT userid, username, password, firstname, lastname, email, project_0.roles.role, roleid
FROM project_0.users INNER JOIN project_0.roles ON project_0.users.role = roleid`;
const findUserQuery = `${findAllUsersQuery} WHERE userid = $1`;
const findRoleQuery = `SELECT * FROM project_0.roles WHERE role = $1`;
const findRoleByIdQuery = `SELECT * FROM project_0.roles WHERE roleid = $1`;
const patchUserQuery = `UPDATE project_0.users SET username = $2, password = $3, firstname = $4, lastname = $5, email = $6, role = $7 WHERE userid = $1`;
const findUserByUsernameQuery = `SELECT * FROM project_0.users WHERE username = $1 AND password = $2`;


export async function getUserByUsername(username: string, password: string): Promise<User> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    result = await client.query(findUserByUsernameQuery, [username, password]);
    const usernameMatchingPassword = result.rows.map((user) => {
      return new User(user.userid, user.username, user.password, user.firstname, user.lastname, user.email, new Role(user.roleid, user.role))
    })
    if (usernameMatchingPassword.length > 0) {
      let roleResults = await client.query(findRoleByIdQuery, [result.rows[0].role]);
      usernameMatchingPassword[0].role.role = roleResults.rows[0].role;
      usernameMatchingPassword[0].role.roleid = roleResults.rows[0].roleid;
      return usernameMatchingPassword[0];
    } else {
      throw new Error(`Username and Password are not matched to a valid user`)
    }
  } catch (e) {
    throw new Error(`Failed to validate User with DB: ${e.message}`)
  } finally {
    client && client.release();
  }
}

export async function getAllUsers(): Promise<User[]> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    result = await client.query(findAllUsersQuery);
    return result.rows.map((user) => {
      return new User(user.userid, user.username, user.password, user.firstname, user.lastname, user.email, new Role(user.roleid, user.role))
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
      let {userid, username, password, firstname, lastname, email, role} = result.rows[0];
      return new User(userid, username, password, firstname, lastname, email, new Role(result.rows[0].roleid, role))
    } else {
      throw new Error(`Couldn't find userId: ${userId} in the database.`)
    }
  } catch(e) {
    throw new Error(`Failed to query for user: ${e.message}`);
  } finally {
    client && client.release();
  }
}

export async function patchUser(user: User): Promise<User> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    result = await client.query(findUserQuery, [user.userid]);
    // console.log(result);
    if (result.rows.length === 1) {
      // Confirm that the role we are trying to change to exists
      if (user.role !== undefined) {
        let roleResults = await client.query(findRoleQuery, [user.role.role]);
        if (roleResults.rows[0].length === 0) {
          throw new Error(`Role: "${user.role.role}" - Is not in our database.`);
        } else if (user.role.roleid != roleResults.rows[0].roleid) {
          throw new Error(`Role "${user.role.role}" exists, but it's roleid is ${roleResults.rows[0].roleid}\nProvide the proper role title and id.`)
        }
      // If the role wasn't provided then we add the role from the database to our user so we don't break line 81
      } else {
        user.role = new Role(result.rows[0].roleid, result.rows[0].role);
      }
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
      let previousRoleId : number = updateArray.pop();
      let role: Role = updateArray.pop();
      updateArray.push(user.role.roleid);

      let patchedResult : QueryResult;
      patchedResult = await client.query(patchUserQuery, updateArray);
      let [userId, userName, password, firstName, lastName, email] = updateArray;
      // For some reason the spead operator isn't working here so I used destructuring
      return new User(userId, userName, password, firstName, lastName, email, role);
    } 
    throw new Error(`Couldn't find user.`);
  } catch(e) {
    throw new Error(`Failed to patch user: ${e.message}`)
  } finally {
    client && client.release();
  }
}