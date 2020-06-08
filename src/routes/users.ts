import express, { Router, Request, Response } from "express";
import { roleIs } from "../tools";
import { PoolClient, QueryResult } from "pg";
import { getAllUsers, getUser, patchUser, getFinanceManagers } from "../repository/userDataAccess";
import { User } from "../models/User";
import { authRoleFactory } from "../middleware/authMiddleware";

export const usersRouter: Router = express.Router();

usersRouter.get("/finance-managers", (req: Request, res: Response) => {
  if (req.session && req.session.user) {
    getFinanceManagers()
      .then((user) => {
        res.json(user);
      })
      .catch((e: Error) => {
        res.json(e.message);
      });
  } else {
    res.json(`Login again... Token expired`).status(400);
  }
})
//* Implement middleware
usersRouter.patch("", (req: Request, res: Response) => {
  let userRole: string = "admin";
  if (req.session && req.session.user) {
    let roleIsAdmin: boolean = roleIs(req.session.user.role.role, userRole);
    let {
      userid,
      username,
      password,
      firstname,
      lastname,
      email,
      role,
    } = req.body;
    let userIsAuthor: boolean = +req.session.user.userid === req.body.userid;
    if (roleIsAdmin || userIsAuthor) {
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
          `You do not have access to users because you are not an ${userRole}.`
        )
        .status(401);
    }
  } else {
    res.json(`Login again... Token expired`).status(400);
  }
});

usersRouter.use(authRoleFactory(["admin", "finance-manager"]));

//* Implement middleware
usersRouter.get("", (req: Request, res: Response) => {
  let userRole1: string = "finance-manager";
  let userRole2: string = "admin";
  if (req.session) {
    let roleIsFinanceManager: boolean = roleIs(
      req.session.user.role.role,
      userRole1
    );
    let roleIsAdmin: boolean = roleIs(
      req.session.user.role.role,
      userRole2
    );
    if (roleIsFinanceManager || roleIsAdmin) {
      console.log("Running get user");
      getAllUsers()
        .then((users: User[]) => res.json(users))
        .catch((e: Error) => res.json(e.message));
    } else {
      res
        .json(
          `You do not have access to users because you are not a ${userRole1} or a ${userRole2}.`
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
