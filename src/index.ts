// Packages
import express from 'express';
import bodyparser from 'body-parser';
// My Modules
import {roleIs} from './Tools';

import {Application, Request, Response} from 'express';

const PORT: number = 3000;
const app: Application = express();

app.use(bodyparser.json());

//* Code to revamp
app.post('/login', (req: Request, res: Response) => {
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

//* Code to revamp
app.get('/users', (req: Request, res: Response) => {
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

//* Code to revamp
app.patch('/users', (req: Request, res: Response) => {
  // if role === admin
  let userRole: string = 'admin';
  let roleIsAdmin: boolean = roleIs('admin', userRole);
  if (roleIsAdmin) {
    // Validate that the input has all the required fields to update a user
    // Anyfield left undefined will not be updated
    res.json("User").status(200);

  } else {
    res.send(res.send(`You do not have access to users because you are not a ${userRole}.`).status(401));
  }
})

//* Code to revamp
app.get('/users/:id', (req: Request, res: Response) => {
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

app.listen(PORT, () => {
  console.log(`App has started on port: ${PORT}`)
})