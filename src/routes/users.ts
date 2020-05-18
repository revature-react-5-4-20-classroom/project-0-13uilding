import express, { Router, Request, Response } from 'express';
import { roleIs } from '../tools';
import { PoolClient, QueryResult } from 'pg';
import { getAllUsers, getUser } from '../repository/userDataAccess';
import { User } from '../models/User';

export const usersRouter : Router = express.Router();

//* Implement middleware
usersRouter.get('', (req: Request, res: Response) => {
  // If role === finance-manager
  let userRole: string = 'finance-manager';
  let roleIsFinanceManager: boolean = roleIs('finance-manager', userRole);
  if (roleIsFinanceManager) {
    console.log('Running get user');
    getAllUsers()
      .then((users: User[]) => {
        res.json(users);
      })
      .catch((e: Error) => {
        res.json(e.message);
      })
  } else {
    res.json('did not gottem');
  }
});

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
    res.json(`You do not have access to users because you are not a ${userRole}.`).status(401);
  }
})

//* Implement middleware
usersRouter.get('/:id', (req: Request, res: Response) => {
  // If role === finance-manager
  let userRole: string = 'finance-manager';
  let queryId: number = +req.params.id;
  let roleIsFinanceManager = roleIs('finance-manager', userRole);
  if (roleIsFinanceManager) { // || userId === queryId
    // Get user and return it
    getUser(queryId)
      .then((user: User) => {
        res.json(user);
      })
      .catch((e: Error) => {
        res.json(e.message);
      })
  } else {
    res.json(`You do not have access to users because you are not a ${userRole}.`).status(401);
  }
})