import express, { Router, Request, Response } from "express";
import { roleIs } from "../tools";
import { PoolClient, QueryResult } from "pg";
import { getAllUsers, getUser, patchUser } from "../repository/userDataAccess";
import { User } from "../models/User";
import { authRoleFactory } from "../middleware/authMiddleware";

export const usersRouter: Router = express.Router();

usersRouter.use(authRoleFactory(["admin", "finance-manager"]));
//* Implement middleware
usersRouter.patch("", (req: Request, res: Response) => {
  let userRole: string = "admin";
  if (req.session) {
    let roleIsAdmin: boolean = roleIs(req.session.user.role.role, userRole);
    if (roleIsAdmin) {
      let {
        userid,
        username,
        password,
        firstname,
        lastname,
        email,
        role,
      } = req.body;
      let user: User = new User(
        userid,
        username,
        password,
        firstname,
        lastname,
        email,
        role
      );
      patchUser(user)
        .then((user: User) => {
          res.json(user);
        })
        .catch((e: Error) => res.json(e.message));
    } else {
      res
        .json(
          `You do not have access to users because you are not a ${userRole}.`
        )
        .status(401);
    }
  } else {
    res.json(`Login again... Token expired`).status(400);
  }
});

//* Implement middleware
usersRouter.get("", (req: Request, res: Response) => {
  let userRole: string = "finance-manager";
  if (req.session) {
    let roleIsFinanceManager: boolean = roleIs(
      req.session.user.role.role,
      userRole
    );
    if (roleIsFinanceManager) {
      console.log("Running get user");
      getAllUsers()
        .then((users: User[]) => res.json(users))
        .catch((e: Error) => res.json(e.message));
    } else {
      res
        .json(
          `You do not have access to users because you are not a ${userRole}.`
        )
        .status(401);
    }
  } else {
    res.json(`Login again... Token expired`).status(400);
  }
});

//* Implement middleware
usersRouter.get("/:id", (req: Request, res: Response) => {
  let queryId: number = +req.params.id;
  let userRole: string = "finance-manager";
  if (req.session) {
    let roleIsFinanceManager: boolean = roleIs(
      req.session.user.role.role,
      userRole
    );
    if (roleIsFinanceManager) {
      getUser(queryId)
        .then((user) => {
          res.json(user);
        })
        .catch((e: Error) => {
          res.json(e.message);
        });
    } else {
      res
        .json(
          `You do not have access to users because you are not a ${userRole}.`
        )
        .status(401);
    }
  } else {
    res.json(`Login again... Token expired`).status(400);
  }
});
