import express, { Request, Response, Router } from 'express';

export const loginRouter : Router = express.Router();

//! Do this later
//* Code to revamp 
loginRouter.post('', (req: Request, res: Response) => {
  let { username, password } : { username: string, password: string} = req.body;
  // I'm getting the username and password
  console.log(
`Username: ${username}
Password: ${password}`)
  // Need to confirm that the username and password match what our database says
  let usernameExists: boolean = true;
  if (usernameExists) {
    let passwordCorrect: boolean = true;
    if (passwordCorrect) {
      // 'OK'
      res.send('User').status(200);
      // I'm guessing we would want to reroute to a new page 
      // 'continue' res.status(200);
    } else {
      res.send("Invalid Credentials").status(400);
    }
  } else {
    //? Not found 404
    res.send("Invalid Credentials").status(400);
  }
})