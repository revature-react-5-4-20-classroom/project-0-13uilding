import { User } from '../models/User';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';
import { Role } from '../models/Role';
import { ReimbursementStatus } from '../models/ReimbursementStatus';

// const findAllUsersQuery = 
// `SELECT userid, username, password, firstname, lastname, email, project_0.roles.role, roleid
// FROM project_0.users INNER JOIN project_0.roles ON project_0.users.role = roleid`;
// const findRoleQuery = `SELECT * FROM project_0.roles WHERE role = $1`;
// const patchUserQuery = `UPDATE project_0.users SET username = $2, password = $3, firstname = $4, lastname = $5, email = $6, role = $7 WHERE userid = $1`;

// datesubmitted, dateresolved, description, project_0.reimbursement_type.type 
const findReimbursementStatusQuery = 
`SELECT reimbursementid, firstname || ' ' || lastname AS fullname, description, amount, datesubmitted, dateresolved, project_0.reimbursement_status.status
FROM project_0.reimbursement 
JOIN project_0.reimbursement_status ON statusid = project_0.reimbursement.status 
JOIN project_0.users ON author = userid
WHERE statusid = $1
ORDER BY datesubmitted asc`;

// export async function getAllUsers(): Promise<User[]> {
//   let client : PoolClient;
//   client = await connectionPool.connect();
//   try {
//     let result : QueryResult;
//     result = await client.query(findAllUsersQuery);
//     return result.rows.map((user) => {
//       return new User(user.userid, user.username, user.password, user.firstname, user.lastname, user.email, new Role(user.roleid, user.role))
//     })
//   } catch(e) {
//     throw new Error(`Failed to query for all users: ${e.message}`);
//   } finally {
//     client && client.release();
//   }
// }

export async function getReimbursementsByStatus(statusid: number): Promise<Array<Object>> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    result = await client.query(findReimbursementStatusQuery, [statusid]);
    console.log(result);
    if (result.rows.length > 0) {
      return result.rows.map((reimbursement) => reimbursement);
    } else {
      throw new Error(`Couldn't find statusId: ${statusid} in the database.`)
    }
  } catch(e) {
    throw new Error(`Failed to query for statusId: ${e.message}`);
  } finally {
    client && client.release();
  }
}