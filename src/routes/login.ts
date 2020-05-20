import express, { Request, Response, Router } from 'express';
import { getUser, getUserByUsername } from '../repository/userDataAccess';

export const loginRouter : Router = express.Router();


loginRouter.post('', async (req: Request, res: Response) => {
  let { username, password } : { username: string, password: string} = req.body;
  // I'm getting the username and password
  console.log(
`Username: ${username}
Password: ${password}`)
  if ( !username || !password ) {
    res.status(400).json('Please include username and password fields')
  } else {
    try {
      const user = await getUserByUsername(username, password)
      if (req.session) {
        req.session.user = user;
      }
      //! This seems dumb. This would include the password... Stretch goals later
      res.json(user);
    } catch (e) {
      res.status(401).json(`UNAUTHORIZED`)
    }
  }
})