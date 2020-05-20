import { User } from '../models/User';
import { PoolClient, QueryResult } from 'pg';
import { connectionPool } from '.';
import { Role } from '../models/Role';
import { ReimbursementStatus } from '../models/ReimbursementStatus';
import { Reimbursement } from '../models/Reimbursement';

const postReimbursementQuery = 
`INSERT INTO project_0.reimbursement (author, amount, dateSubmitted, dateResolved, description, resolver, status, "type")
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
const findReimbursementUserQuery = 
`SELECT reimbursementid, auth.firstname || ' ' || auth.lastname AS auth_fullname, description, amount, datesubmitted, dateresolved, reso.firstname || ' ' || reso.lastname AS reso_fullname, project_0.reimbursement_status.status
FROM project_0.reimbursement
JOIN project_0.reimbursement_status ON statusid = project_0.reimbursement.status 
JOIN project_0.users auth ON auth.userid = author
JOIN project_0.users reso ON reso.userid = resolver
WHERE auth.userid = $1
ORDER BY datesubmitted asc`;
const findReimbursementStatusQuery = 
`SELECT reimbursementid, firstname || ' ' || lastname AS fullname, description, amount, datesubmitted, dateresolved, project_0.reimbursement_status.status
FROM project_0.reimbursement 
JOIN project_0.reimbursement_status ON statusid = project_0.reimbursement.status 
JOIN project_0.users ON author = userid
WHERE statusid = $1
ORDER BY datesubmitted asc`;
const genericFieldValidation = (field: string, table: string) : string => {
  return `SELECT * FROM project_0.${table} WHERE ${field} = $1`;
}

export async function postReimbursement(reimbursement: Reimbursement): Promise<Reimbursement> {
  let client : PoolClient;
  client = await connectionPool.connect();
  try {
    let result : QueryResult;
    let { author, amount, dateSubmitted, dateResolved, description, resolver, status, type } = reimbursement;

    // Need to determine if the author, resolver, status, and type correspond to actual values in the DB before creating new reimbursement
    let authorResult : QueryResult = await client.query(genericFieldValidation("userid", "users"), [author]);
    if (authorResult.rows.length === 0) throw new Error(`Author with the userid ${author} doesn't exist in the database. Use a valid userid.`);
    let resolverResult : QueryResult = await client.query(genericFieldValidation("userid", "users"), [resolver]);
    if (resolverResult.rows.length === 0) throw new Error(`Resolver with the userid ${resolver} doesn't exist in the database. Use a valid userid.`);
    let statusResult : QueryResult = await client.query(genericFieldValidation("statusid", "reimbursement_status"), [status]);
    if (statusResult.rows.length === 0) throw new Error(`Status with the statusid ${status} doesn't exist in the database. Use a valid statusid.`);
    let typeResult : QueryResult = await client.query(genericFieldValidation("typeid", "reimbursement_type"), [type]);
    if (typeResult.rows.length === 0) throw new Error(`Type with the typeid ${type} doesn't exist in the database. Use a valid typeid.`);


    result = await client.query(postReimbursementQuery, [author, amount, dateSubmitted, dateResolved, description, resolver, status, type]);
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

