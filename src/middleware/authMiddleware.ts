import express, {Request, Response, NextFunction} from 'express';

export function authRoleFactory(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.session);
    if(!req.session || !req.session.user) {
      res.status(401).json('The incoming token has expired');
    } else {
      let allowed = false;
      for(let role of roles) {
        // console.log(role);
        if(req.session.user.role.role === role) {
          allowed = true;
        }
      }
      if(allowed) {
        next();
      } else {
        res.status(401).send(`UNAUTHORIZED with role: ${req.session.user.role}`);
      }
    }
  }
}
