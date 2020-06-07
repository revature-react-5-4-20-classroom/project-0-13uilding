import { User } from '../models/User';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';
import { Role } from '../models/Role';
import { ReimbursementStatus } from '../models/ReimbursementStatus';
import { Reimbursement } from '../models/Reimbursement';

const findReimbursementQuery = 
`SELECT *
FROM project_0.reimbursement
WHERE reimbursementid = $1
ORDER BY datesubmitted asc`;
const patchReimbursementQuery = 
`UPDATE project_0.reimbursement SET author = $2, amount = $3, datesubmitted = $4, dateresolved = $5, description = $6, resolver = $7, status = $8, type = $9 
WHERE reimbursementid = $1`;
const postReimbursementQuery = 
`INSERT INTO project_0.reimbursement (author, amount, datesubmitted, dateresolved, description, resolver, status, "type")
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
const findReimbursementUserQuery = 
`SELECT *
FROM project_0.reimbursement
WHERE author = $1
ORDER BY datesubmitted asc`;
const findReimbursementStatusQuery = 
`SELECT *
FROM project_0.reimbursement
WHERE status = $1
ORDER BY datesubmitted asc`;
const genericFieldValidation = (field: string, table: string) : string => {
  return `SELECT * FROM project_0.${table} WHERE ${field} = $1`;
}

export async function patchReimbursement(reimbursement: Reimbursement): Promise<Reimbursement> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    result = await client.query(findReimbursementQuery, [reimbursement.reimbursementid]);
    if (result.rows.length === 1) {
      let updateArray : any[] = [];
      let validationArray : string[] = ['author', 'resolver', 'status', 'type'];
      // Append our patchUserQuery with all the rows that are passed in
      for (let field in result.rows[0]) {
        if (reimbursement[field] !== undefined) {
          if (validationArray.includes(field)) {
            let columnName: string = '';
            let tableName: string = '';
            let value: number = 0;
            switch (field) {
              case 'author':
                columnName = 'userid';
                tableName = 'users';
                value = result.rows[0].author;
                break;
              case 'resolver':
                columnName = 'userid';
                tableName = 'users';
                value = result.rows[0].resolver;
                break;
              case 'status':
                columnName = 'statusid';
                tableName = 'reimbursement_status';
                value = result.rows[0].status;
                break;
              case 'type':
                columnName = 'typeid';
                tableName = 'reimbursement_type';
                value = result.rows[0].type;
                break;
            }
            if (field === 'resolver' && value === null) {
              console.log('Resolver field from our database was null... skipping validation')
            } else {
              let genericResult : QueryResult = await client.query(genericFieldValidation(columnName, tableName), [value]);
              if (genericResult.rows.length === 0) throw new Error(`Table: ${tableName} does not have a value: ${value} in column ${columnName}`);
            }     
          }
          updateArray.push(reimbursement[field]);
        } else {
          updateArray.push(result.rows[0][field]);
        }
      }
      let patchedResult : QueryResult;
      patchedResult = await client.query(patchReimbursementQuery, updateArray);
      let [ reimbursementid, author, amount, datesubmitted, dateresolved, description, resolver, status, type ] = updateArray;
      // For some reason the spead operator isn't working here so I used destructuring
      return new Reimbursement(reimbursementid, author, amount, datesubmitted, dateresolved, description, resolver, status, type);
    } 
    throw new Error(`Couldn't find reimbursement.`);
  } catch(e) {
    throw new Error(`Failed to patch reimbursement: ${e.message}`)
  } finally {
    client && client.release();
  }
}

export async function postReimbursement(reimbursement: Reimbursement): Promise<Reimbursement> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    let { author, amount, datesubmitted, dateresolved, description, resolver, status, type } = reimbursement;

    // Need to determine if the author, resolver, status, and type correspond to actual values in the DB before creating new reimbursement
    let authorResult : QueryResult = await client.query(genericFieldValidation("userid", "users"), [author]);
    if (authorResult.rows.length === 0) throw new Error(`Author with the userid ${author} doesn't exist in the database. Use a valid userid.`);
    //! CHANGED ON 6/6/20
    // let resolverResult : QueryResult = await client.query(genericFieldValidation("userid", "users"), [resolver]);
    // if (resolverResult.rows.length === 0) throw new Error(`Resolver with the userid ${resolver} doesn't exist in the database. Use a valid userid.`);
    let statusResult : QueryResult = await client.query(genericFieldValidation("statusid", "reimbursement_status"), [status]);
    if (statusResult.rows.length === 0) throw new Error(`Status with the statusid ${status} doesn't exist in the database. Use a valid statusid.`);
    let typeResult : QueryResult = await client.query(genericFieldValidation("typeid", "reimbursement_type"), [type]);
    if (typeResult.rows.length === 0) throw new Error(`Type with the typeid ${type} doesn't exist in the database. Use a valid typeid.`);


    result = await client.query(postReimbursementQuery, [author, amount, datesubmitted, dateresolved, description, resolver, status, type]);
    if (result.rowCount === 1) {
      return reimbursement;
    } else {
      throw new Error(`Did not add reimbursement in the database.`)
    }
  } catch(e) {
    throw new Error(`Failed to query for userId: ${e.message}`);
  } finally {
    client && client.release();
  }
}

export async function getReimbursementsByUser(userid: number): Promise<Array<Object>> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    result = await client.query(findReimbursementUserQuery, [userid]);
    if (result.rows.length > 0) {
      return result.rows.map((reimbursement) => reimbursement);
    } else {
      throw new Error(`Couldn't find any reimbursements for userId: ${userid} in the database.`)
    }
  } catch(e) {
    throw new Error(`Failed to query for userId: ${e.message}`);
  } finally {
    client && client.release();
  }
}

export async function getReimbursementsByStatus(statusid: number): Promise<Array<Object>> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    result = await client.query(findReimbursementStatusQuery, [statusid]);
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

