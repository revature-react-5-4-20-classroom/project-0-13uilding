import express, { Router, Request, Response } from 'express';
import { roleIs } from '../tools';

export const usersRouter : Router = express.Router();

//* Implement middleware
usersRouter.get('', (req: Request, res: Response) => {
  // If role === finance-manager
  let userRole: string = 'finance-manager';
  let roleIsFinanceManager: boolean = roleIs('finance-manager', userRole);
  if (roleIsFinanceManager) {
    // Get our users and return them in an array
    res.json("Users Array").status(200);
  } else {
    res.send(`You do not have access to users because you are not a ${userRole}.`).status(401);
  }
})

//* Implement middleware
usersRouter.patch('', (req: Request, res: Response) => {
  // if role === admin
  let userRole: string = 'admin';
  let roleIsAdmin: boolean = roleIs('admin', userRole);
  if (roleIsAdmin) {
    // Validate that the input has all the required fields to update a user
    // Anyfield left undefined will not be updated
    res.json("User patch").status(200);

  } else {
    res.send(res.send(`You do not have access to users because you are not a ${userRole}.`).status(401));
  }
})

//* Implement middleware
usersRouter.get('/:id', (req: Request, res: Response) => {
  // If role === finance-manager
  let userRole: string = 'finance-manager';
  let queryId: number = parseInt(req.params.id);
  let userId: number = 666;
  let roleIsFinanceManager = roleIs('finance-manager', userRole);
  if (roleIsFinanceManager || userId === queryId) {
    // Get user and return it
    res.json(`User ${queryId}`).status(200);
  } else {
    res.send(`You do not have access to users because you are not a ${userRole}.`).status(401);
  }
})