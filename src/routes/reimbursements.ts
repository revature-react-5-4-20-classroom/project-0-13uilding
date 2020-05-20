import express, { Router, Request, Response } from 'express';
import { roleIs } from '../tools';
import { getReimbursementsByStatus, getReimbursementsByUser, postReimbursement, patchReimbursement } from '../repository/reimbursementDataAcess';
import { Reimbursement } from '../models/Reimbursement';

export const reimbursementsRouter : Router = express.Router();

// post
// req Reimbursement
// res Reimbursement
reimbursementsRouter.post('', (req: Request, res: Response) => {
  let { author, amount, dateSubmitted, dateResolved, description, resolver, status, type } = req.body;
  // Some basic validation
  if (author <= 0 || amount <= 0 || resolver <= 0 || status <= 0 || type <= 0) {
    res.send('Cannot have a number less than or equal to 0 as a field of the created reimbursement').status(400);
  }
  postReimbursement(new Reimbursement(0, author, amount, dateSubmitted, dateResolved, description, resolver, status, type))
    .then((reimbursement: Reimbursement) => res.json(reimbursement).status(201))
    .catch((e: Error) => res.json(e.message))
})

// patch
// auth 'finance-manager'
// req all the parts of a reimbursement all fields left undefined will not be updated
// res reimbursement
reimbursementsRouter.patch('', (req: Request, res: Response) => {
  //* Replace with middleware
  let userRole: string = 'finance-manager';
  let roleIsFinanceManager: boolean = roleIs('finance-manager', userRole);
  if (roleIsFinanceManager) {
    // Get our users and return them in an array
    let { reimbursementid, author, amount, dateSubmitted, dateResolved, description, resolver, status, type } = req.body;
    // Some basic validation
    if (author <= 0 || amount <= 0 || resolver <= 0 || status <= 0 || type <= 0) {
      res.send('Cannot have a number less than or equal to 0 as a field of the created reimbursement').status(400);
    }
    patchReimbursement(new Reimbursement( reimbursementid, author, amount, dateSubmitted, dateResolved, description, resolver, status, type ))
      .then((reimbursement: Reimbursement) => res.json(reimbursement).status(200))
      .catch((e: Error) => res.json(e.message))
  } else {
    res.send(`You do not have access to users because you are not a ${userRole}.`).status(401);
  }
})

// '/status/:statusId' get
// auth 'finance-manager'
// res Reimbursement
reimbursementsRouter.get('/status/:statusId', (req: Request, res: Response) => {
  //* Replace with middleware
  let userRole: string = 'finance-manager';
  let statusId: number = +req.params.statusId;
  console.log(`StatusId, ${statusId}, has type of: ${typeof statusId}`);
  let roleIsFinanceManager: boolean = roleIs('finance-manager', userRole);
  if (roleIsFinanceManager) {
    // Get our users and return them in an array
    getReimbursementsByStatus(statusId)
      .then((reimbursements: Array<Object>) => res.json(reimbursements))
      .catch((e: Error) => res.json(e.message))
  } else {
    res.send(`You do not have access to users because you are not a ${userRole}.`).status(401);
  }
})

// '/author/userId' get
// auth 'finance-manager' or userId matching request
// res reimbursement
reimbursementsRouter.get('/author/:userId', (req: Request, res: Response) => {
  //* Replace with middleware
  let userRole: string = 'finance-manager';
  let userId: number = +req.params.userId;
  let roleIsFinanceManager: boolean = roleIs('finance-manager', userRole);
  if (roleIsFinanceManager) {
    // Get our users and return them in an array
    getReimbursementsByUser(userId)
      .then((reimbursements: Array<Object>) => res.json(reimbursements))
      .catch((e: Error) => res.json(e.message))
  } else {
    res.send(`You do not have access to users because you are not a ${userRole}.`).status(401);
  }
})